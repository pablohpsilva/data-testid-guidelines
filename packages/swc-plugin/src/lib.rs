use swc_core::ecma::{
    ast::*,
    transforms::testing::test_inline,
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default = "default_separator")]
    pub separator: String,
    #[serde(default = "default_true")]
    pub include_element: bool,
    #[serde(default = "default_true")]
    pub use_hierarchy: bool,
    #[serde(default = "default_skip_elements")]
    pub skip_elements: Vec<String>,
    #[serde(default = "default_false")]
    pub only_interactive: bool,
}

fn default_separator() -> String {
    ".".to_string()
}

fn default_true() -> bool {
    true
}

fn default_false() -> bool {
    false
}

fn default_skip_elements() -> Vec<String> {
    vec![
        "br".to_string(),
        "hr".to_string(),
        "img".to_string(),
        "svg".to_string(),
    ]
}

impl Default for Config {
    fn default() -> Self {
        Self {
            separator: default_separator(),
            include_element: default_true(),
            use_hierarchy: default_true(),
            skip_elements: default_skip_elements(),
            only_interactive: default_false(),
        }
    }
}

pub struct AutoTestIdTransform {
    config: Config,
    component_stack: Vec<String>,
    element_stack: Vec<String>,
    in_map_call: bool,
    map_index_param: Option<String>,
}

impl AutoTestIdTransform {
    pub fn new(config: Config) -> Self {
        Self {
            config,
            component_stack: Vec::new(),
            element_stack: Vec::new(),
            in_map_call: false,
            map_index_param: None,
        }
    }

    fn get_component_name(&self, ident: Option<&Ident>) -> Option<String> {
        ident.map(|id| id.sym.to_string())
    }

    fn should_add_test_id(&self, element_name: &str, existing_attrs: &[JSXAttrOrSpread]) -> bool {
        // Check if data-testid already exists
        for attr in existing_attrs {
            if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
                if let JSXAttrName::Ident(ident) = &jsx_attr.name {
                    if ident.sym == "data-testid" {
                        return false; // Already has data-testid
                    }
                }
            }
        }

        // Check skip elements
        if self.config.skip_elements.contains(&element_name.to_string()) {
            return false;
        }

        // Check only interactive
        if self.config.only_interactive {
            let interactive_elements = vec!["button", "input", "select", "textarea", "a", "form"];
            return interactive_elements.contains(&element_name);
        }

        true
    }

    fn generate_test_id(&self, element_name: &str, is_template_literal: &mut bool) -> String {
        // Skip if no parent component (avoid test IDs on elements with no component context)
        if self.component_stack.is_empty() {
            return String::new();
        }

        let mut parts = Vec::new();

        // Add component hierarchy
        if self.config.use_hierarchy {
            parts.extend(self.component_stack.iter().cloned());
        }

        // Add element hierarchy for better path tracking
        if self.config.include_element {
            // Include most HTML elements except basic formatting ones
            let exclude_elements = vec![
                "b", "i", "em", "strong", "small", "mark", "del", "ins", "sub", "sup",
                "br", "hr", "wbr", "img", "svg", "picture", "source", "audio", "video", "track",
                "meta", "link", "style", "script", "noscript", "template"
            ];
            
            // Add element hierarchy for better path building
            for elem in &self.element_stack {
                if !exclude_elements.contains(&elem.as_str()) {
                    parts.push(elem.clone());
                }
            }
            
            // Add current element if not excluded
            if !exclude_elements.contains(&element_name) {
                // For list items, build proper hierarchy with indexing
                if element_name == "li" {
                    // Check if we have a ul in our element stack (indicating we're in a list)
                    let has_ul_parent = self.element_stack.iter().any(|elem| elem == "ul" || elem == "ol");
                    if has_ul_parent {
                        parts.push("item".to_string());
                        // Signal that we need a template literal for indexing
                        *is_template_literal = true;
                        return format!("{}.${{index}}", parts.join(&self.config.separator));
                    } else {
                        parts.push("item".to_string());
                    }
                } else {
                    parts.push(element_name.to_string());
                }
            }
        }

        parts.join(&self.config.separator)
    }

    fn is_loop_context(&self, _jsx_element: &JSXElement) -> bool {
        // For now, we'll implement basic loop detection
        // In a more sophisticated implementation, we'd analyze the parent context
        // to detect if we're inside a .map() call
        false
    }
}

impl VisitMut for AutoTestIdTransform {
    fn visit_mut_function(&mut self, func: &mut Function) {
        // Track function components (functions that start with uppercase)
        func.visit_mut_children_with(self);
    }

    fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
        // Track arrow function components
        arrow.visit_mut_children_with(self);
    }

    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        // Detect .map() calls to track loop context
        let was_in_map = self.in_map_call;
        
        if let Callee::Expr(expr) = &call.callee {
            if let Expr::Member(member_expr) = expr.as_ref() {
                if let MemberProp::Ident(prop_ident) = &member_expr.prop {
                    if prop_ident.sym == "map" {
                        self.in_map_call = true;
                        
                        // Try to extract the index parameter name
                        if let Some(first_arg) = call.args.first() {
                            if let Expr::Arrow(arrow) = first_arg.expr.as_ref() {
                                if arrow.params.len() >= 2 {
                                    if let Pat::Ident(ident) = &arrow.params[1] {
                                        self.map_index_param = Some(ident.sym.to_string());
                                    }
                                }
                            } else if let Expr::Fn(func_expr) = first_arg.expr.as_ref() {
                                if func_expr.function.params.len() >= 2 {
                                    if let Pat::Ident(ident) = &func_expr.function.params[1].pat {
                                        self.map_index_param = Some(ident.sym.to_string());
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Visit children
        call.visit_mut_children_with(self);
        
        // Restore previous state
        self.in_map_call = was_in_map;
        if !was_in_map {
            self.map_index_param = None;
        }
    }

    fn visit_mut_var_declarator(&mut self, var_decl: &mut VarDeclarator) {
        // Check if this is a component declaration (starts with uppercase)
        if let Pat::Ident(ident) = &var_decl.name {
            let name = ident.sym.to_string();
            if name.chars().next().unwrap_or('a').is_uppercase() {
                self.component_stack.push(name);
                var_decl.visit_mut_children_with(self);
                self.component_stack.pop();
                return;
            }
        }
        var_decl.visit_mut_children_with(self);
    }

    fn visit_mut_fn_decl(&mut self, fn_decl: &mut FnDecl) {
        // Track function component declarations
        let name = fn_decl.ident.sym.to_string();
        if name.chars().next().unwrap_or('a').is_uppercase() {
            self.component_stack.push(name);
            fn_decl.visit_mut_children_with(self);
            self.component_stack.pop();
        } else {
            fn_decl.visit_mut_children_with(self);
        }
    }

    fn visit_mut_jsx_element(&mut self, jsx_element: &mut JSXElement) {
        // Get element name
        if let JSXElementName::Ident(ident) = &jsx_element.opening.name {
            let element_name = ident.sym.to_string();
            
            // Add element to stack for hierarchy tracking
            self.element_stack.push(element_name.clone());
            
            // Check if we should add test id
            if self.should_add_test_id(&element_name, &jsx_element.opening.attrs) {
                // Generate test ID
                let mut is_template_literal = false;
                let test_id = self.generate_test_id(&element_name, &mut is_template_literal);
                
                if !test_id.is_empty() {
                    // Create data-testid attribute
                    let test_id_value = if is_template_literal {
                        // For template literals (like Navigation.ul.item.${index})
                        let index_var = self.map_index_param.clone().unwrap_or_else(|| "index".to_string());
                        let base_id = test_id.replace("${index}", "");
                        
                        JSXAttrValue::JSXExprContainer(JSXExprContainer {
                            span: swc_core::common::DUMMY_SP,
                            expr: JSXExpr::Expr(Box::new(Expr::Tpl(Tpl {
                                span: swc_core::common::DUMMY_SP,
                                exprs: vec![Box::new(Expr::Ident(Ident::new(index_var.into(), swc_core::common::DUMMY_SP)))],
                                quasis: vec![
                                    TplElement {
                                        span: swc_core::common::DUMMY_SP,
                                        tail: false,
                                        cooked: Some(base_id.clone().into()),
                                        raw: base_id.into(),
                                    },
                                    TplElement {
                                        span: swc_core::common::DUMMY_SP,
                                        tail: true,
                                        cooked: Some("".into()),
                                        raw: "".into(),
                                    },
                                ],
                            }))),
                        })
                    } else {
                        // For regular string literals
                        JSXAttrValue::Lit(Lit::Str(Str {
                            span: swc_core::common::DUMMY_SP,
                            value: test_id.into(),
                            raw: None,
                        }))
                    };
                    
                    let test_id_attr = JSXAttrOrSpread::JSXAttr(JSXAttr {
                        span: swc_core::common::DUMMY_SP,
                        name: JSXAttrName::Ident(Ident::new("data-testid".into(), swc_core::common::DUMMY_SP)),
                        value: Some(test_id_value),
                    });
                    
                    // Add the attribute
                    jsx_element.opening.attrs.push(test_id_attr);
                }
            }
        
            // Continue visiting children
            jsx_element.visit_mut_children_with(self);
            
            // Clean up: remove element from stack
            self.element_stack.pop();
        }
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let config = serde_json::from_str(
        &metadata
            .get_transform_plugin_config()
            .unwrap_or_else(|| "{}".to_string()),
    )
    .unwrap_or_default();

    program.fold_with(&mut as_folder(AutoTestIdTransform::new(config)))
}
