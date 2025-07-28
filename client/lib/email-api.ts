// Email API utility functions for client-side calls

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const emailAPI = {
  /**
   * Send order confirmation emails (customer + admin)
   */
  sendOrderConfirmation: async (orderNumber: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/email/order-confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderNumber }),
        },
      );

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(`Failed to parse response: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.error || data.message || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      console.error("❌ Error sending order confirmation emails:", error);
      throw error;
    }
  },

  /**
   * Send order status update email to customer
   */
  sendOrderStatusUpdate: async (
    orderNumber: string,
    oldStatus: string,
    newStatus: string,
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/email/order-status-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderNumber,
            oldStatus,
            newStatus,
          }),
        },
      );

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(`Failed to parse response: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.error || data.message || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      console.error("❌ Error sending order status update email:", error);
      throw error;
    }
  },

  /**
   * Send test email (development only)
   */
  sendTestEmail: async (to: string, subject: string, message: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/email/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      console.error("❌ Error sending test email:", error);
      throw error;
    }
  },
};
