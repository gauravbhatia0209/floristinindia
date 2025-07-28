import express from 'express';
import { supabase } from '../lib/supabase.js';
import { sendOrderConfirmationEmails, sendOrderStatusUpdateEmail } from '../lib/email-service.js';

const router = express.Router();

// Send order confirmation emails (customer + admin)
router.post('/order-confirmation', async (req, res) => {
  try {
    const { orderNumber } = req.body;

    if (!orderNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order number is required' 
      });
    }

    console.log(`📧 Sending order confirmation emails for order: ${orderNumber}`);

    // Fetch complete order data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(name, email, phone)
      `)
      .eq('order_number', orderNumber)
      .single();

    if (orderError || !order) {
      console.error('❌ Error fetching order:', orderError);
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    // Parse order items if they're stored as JSON string
    let items = order.items;
    if (typeof order.items === 'string') {
      try {
        items = JSON.parse(order.items);
      } catch (parseError) {
        console.error('❌ Error parsing order items:', parseError);
        items = [];
      }
    }

    const orderData = {
      order,
      customer: order.customer,
      items: items || []
    };

    // Send emails
    await sendOrderConfirmationEmails(orderData);

    res.json({ 
      success: true, 
      message: 'Order confirmation emails sent successfully' 
    });

  } catch (error) {
    console.error('❌ Error in order confirmation email route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send order confirmation emails' 
    });
  }
});

// Send order status update email
router.post('/order-status-update', async (req, res) => {
  try {
    const { orderNumber, oldStatus, newStatus } = req.body;

    if (!orderNumber || !oldStatus || !newStatus) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order number, old status, and new status are required' 
      });
    }

    console.log(`📧 Sending order status update email for order: ${orderNumber} (${oldStatus} → ${newStatus})`);

    // Fetch complete order data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(name, email, phone)
      `)
      .eq('order_number', orderNumber)
      .single();

    if (orderError || !order) {
      console.error('❌ Error fetching order:', orderError);
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    const orderData = {
      order,
      customer: order.customer
    };

    // Send status update email
    await sendOrderStatusUpdateEmail(orderData, oldStatus, newStatus);

    res.json({ 
      success: true, 
      message: 'Order status update email sent successfully' 
    });

  } catch (error) {
    console.error('❌ Error in order status update email route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send order status update email' 
    });
  }
});

// Test email endpoint (for development)
router.post('/test', async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'To, subject, and message are required' 
      });
    }

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email</h2>
          <p>${message}</p>
          <p><em>This is a test email from Florist in India email service.</em></p>
        </div>
      `,
    });

    res.json({ 
      success: true, 
      message: 'Test email sent successfully' 
    });

  } catch (error) {
    console.error('❌ Error sending test email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send test email' 
    });
  }
});

export default router;
