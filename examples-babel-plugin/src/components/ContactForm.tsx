import React, { useState } from "react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
  newsletter: boolean;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
    newsletter: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert(`Thank you, ${formData.name}! Your message has been sent.`);

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      priority: "medium",
      newsletter: false,
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="contact-form">
      <header className="form-header">
        <h3>Get in Touch</h3>
        <p>Send us a message and we'll get back to you soon!</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What is this about?"
          />
          {errors.subject && (
            <span className="error-message">{errors.subject}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about your inquiry..."
            rows={6}
          />
          {errors.message && (
            <span className="error-message">{errors.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              name="newsletter"
              type="checkbox"
              checked={formData.newsletter}
              onChange={handleChange}
            />
            <span>Subscribe to our newsletter for updates</span>
          </label>
        </div>

        <footer className="form-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
                priority: "medium",
                newsletter: false,
              })
            }
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </footer>
      </form>
    </div>
  );
}
