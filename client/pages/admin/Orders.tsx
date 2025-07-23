import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Truck,
  Phone,
  Mail,
  MapPin,
  X,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { Order, Customer } from "@shared/database.types";

interface OrderWithCustomer extends Order {
  customer: Customer | null; // Customer can be null if order was created without customer data
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryDateFilter, setDeliveryDateFilter] = useState<string>("");
  const [productImages, setProductImages] = useState<Record<string, string>>(
    {},
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchQuery, deliveryDateFilter]);

  async function fetchOrders() {
    try {
      const { data } = await supabase
        .from("orders")
        .select(
          `
          *,
          customer:customers(*)
        `,
        )
        .order("created_at", { ascending: false });

      if (data) {
        const ordersWithCustomer = data as OrderWithCustomer[];

        // Log any orders with null customers for debugging
        const ordersWithNullCustomer = ordersWithCustomer.filter(
          (order) => !order.customer,
        );
        if (ordersWithNullCustomer.length > 0) {
          console.warn(
            `Found ${ordersWithNullCustomer.length} orders with null customer data:`,
            ordersWithNullCustomer.map((order) => order.order_number),
          );
        }

        // Ensure all orders have a safe customer object structure
        const safeOrders = ordersWithCustomer.map((order) => ({
          ...order,
          customer: order.customer || null,
        }));

        setOrders(safeOrders);
        await fetchProductImagesForOrders(safeOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      // Set empty array on error to prevent crashes
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProductImagesForOrders(orders: OrderWithCustomer[]) {
    try {
      // Get all unique product IDs from all orders
      const productIds = new Set<string>();
      orders.forEach((order) => {
        order.items.forEach((item: any) => {
          if (item.product_id) {
            productIds.add(item.product_id);
          }
        });
      });

      if (productIds.size > 0) {
        const { data: products } = await supabase
          .from("products")
          .select("id, image_url")
          .in("id", Array.from(productIds));

        if (products) {
          const imageMap: Record<string, string> = {};
          products.forEach((product) => {
            imageMap[product.id] = product.image_url;
          });
          setProductImages(imageMap);
        }
      }
    } catch (error) {
      console.error("Failed to fetch product images:", error);
    }
  }

  function filterOrders() {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(query) ||
          (order.customer?.first_name &&
            order.customer.first_name.toLowerCase().includes(query)) ||
          (order.customer?.last_name &&
            order.customer.last_name.toLowerCase().includes(query)) ||
          (order.customer?.email &&
            order.customer.email.toLowerCase().includes(query)) ||
          (order.receiver_name &&
            order.receiver_name.toLowerCase().includes(query)),
      );
    }

    // Filter by delivery date
    if (deliveryDateFilter) {
      filtered = filtered.filter((order) => {
        if (!order.delivery_date) return false;
        // Compare dates in YYYY-MM-DD format
        const orderDeliveryDate = new Date(order.delivery_date).toISOString().split('T')[0];
        return orderDeliveryDate === deliveryDateFilter;
      });
    }

    setFilteredOrders(filtered);
  }

  async function updateOrderStatus(
    orderId: string,
    newStatus: Order["status"],
  ) {
    try {
      await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  }

  function getStatusColor(status: Order["status"]) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) =>
      ["confirmed", "processing"].includes(o.status),
    ).length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">
            Track and manage customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.processing}
              </p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {stats.shipped}
              </p>
              <p className="text-sm text-muted-foreground">Shipped</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.delivered}
              </p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search orders by number, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Input
                type="date"
                placeholder="Filter by delivery date"
                value={deliveryDateFilter}
                onChange={(e) => setDeliveryDateFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            {(deliveryDateFilter || statusFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDeliveryDateFilter("");
                  setStatusFilter("all");
                }}
                className="px-3"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No orders found</p>
                {searchQuery && <p>Try adjusting your search criteria</p>}
              </div>
            ) : (
              filteredOrders.map((order) => {
                // Safe render with error protection
                try {
                  return (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">
                              #{order.order_number}
                            </h3>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Customer</p>
                              <p>
                                {order.customer?.first_name || "Unknown"}{" "}
                                {order.customer?.last_name || "Customer"}
                              </p>
                              <p className="text-muted-foreground">
                                {order.customer?.email || "No email provided"}
                              </p>
                              {order.customer?.phone && (
                                <p className="text-muted-foreground">
                                  {order.customer.phone}
                                </p>
                              )}
                              {order.receiver_name &&
                                order.receiver_name !==
                                  `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`.trim() && (
                                  <p className="text-sm font-medium text-blue-600">
                                    📧 Receiver: {order.receiver_name}
                                  </p>
                                )}
                            </div>

                            <div>
                              <p className="font-medium">Order Details</p>
                              <p>₹{order.total_amount.toLocaleString()}</p>
                              <p className="text-muted-foreground">
                                {order.items.length} item
                                {order.items.length !== 1 ? "s" : ""}
                              </p>
                              <p className="text-muted-foreground">
                                {formatDate(order.created_at)}
                              </p>
                            </div>

                            <div>
                              <p className="font-medium">Delivery</p>
                              {order.delivery_date && (
                                <p>
                                  Date:{" "}
                                  {new Date(
                                    order.delivery_date,
                                  ).toLocaleDateString()}
                                </p>
                              )}
                              {order.delivery_slot && (
                                <p>Slot: {order.delivery_slot}</p>
                              )}
                              {order.tracking_number && (
                                <p className="text-muted-foreground">
                                  Track: {order.tracking_number}
                                </p>
                              )}
                              {order.customer_message && (
                                <p className="text-sm text-blue-600">
                                  💬 Has Message
                                </p>
                              )}
                              {order.uploaded_files &&
                                order.uploaded_files.length > 0 && (
                                  <p className="text-sm text-green-600">
                                    📎 {order.uploaded_files.length} File
                                    {order.uploaded_files.length !== 1
                                      ? "s"
                                      : ""}
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value: Order["status"]) =>
                              updateOrderStatus(order.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="processing">
                                Processing
                              </SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">
                                Delivered
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                              <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                } catch (error) {
                  console.error("Error rendering order:", order.id, error);
                  return (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 bg-red-50"
                    >
                      <p className="text-red-600">
                        Error loading order #{order.order_number}
                      </p>
                    </div>
                  );
                }
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order Details - #{selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedOrder.customer?.first_name || "Unknown"}{" "}
                        {selectedOrder.customer?.last_name || "Customer"}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedOrder.customer?.email || "No email provided"}
                      </p>
                      {selectedOrder.customer?.phone && (
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {selectedOrder.customer.phone}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Total Orders:</span>{" "}
                        {selectedOrder.customer?.total_orders || 0}
                      </p>
                      <p>
                        <span className="font-medium">Total Spent:</span> ₹
                        {(
                          selectedOrder.customer?.total_spent || 0
                        ).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>
                          ₹
                          {(
                            selectedOrder.total_amount -
                            selectedOrder.shipping_amount -
                            selectedOrder.tax_amount +
                            selectedOrder.discount_amount
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>
                          ₹{selectedOrder.shipping_amount.toLocaleString()}
                        </span>
                      </div>
                      {selectedOrder.discount_amount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>
                            -₹{selectedOrder.discount_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>
                          ₹{selectedOrder.tax_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>
                          ₹{selectedOrder.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(selectedOrder.items || []).map(
                        (item: any, index: number) => (
                          <div key={index} className="flex gap-4 border-b pb-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              {productImages[item.product_id] ? (
                                <div
                                  className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
                                  onClick={() =>
                                    setSelectedImage(
                                      productImages[item.product_id],
                                    )
                                  }
                                >
                                  <img
                                    src={productImages[item.product_id]}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                                    <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Eye className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {item.product_name}
                              </h4>
                              {item.variant_name && (
                                <p className="text-sm text-muted-foreground">
                                  Variant: {item.variant_name}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity}
                              </p>
                              {item.uploaded_file_name && (
                                <div className="mt-2 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                                  <p className="text-sm font-medium text-blue-800">
                                    📎 Customer Uploaded File
                                  </p>
                                  <p className="text-sm text-blue-600 font-mono">
                                    {item.uploaded_file_name}
                                  </p>
                                  {item.uploaded_file_size && (
                                    <p className="text-xs text-blue-500">
                                      Size:{" "}
                                      {(
                                        item.uploaded_file_size /
                                        1024 /
                                        1024
                                      ).toFixed(2)}{" "}
                                      MB
                                    </p>
                                  )}
                                  {item.uploaded_file_type && (
                                    <p className="text-xs text-blue-500">
                                      Type: {item.uploaded_file_type}
                                    </p>
                                  )}
                                  {item.uploaded_file_url &&
                                  item.uploaded_file_url !==
                                    "pending-upload" ? (
                                    <div className="mt-2">
                                      <a
                                        href={item.uploaded_file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
                                      >
                                        📁 Download File
                                      </a>
                                    </div>
                                  ) : item.upload_status ? (
                                    <p className="text-xs text-red-500 mt-1">
                                      ❌ Upload Status: {item.upload_status}
                                    </p>
                                  ) : (
                                    <p className="text-xs text-gray-500 mt-1">
                                      File information available
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              <p className="font-medium">
                                ₹{item.total_price.toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ₹{item.unit_price} each
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p>
                          <strong>Receiver:</strong>{" "}
                          {selectedOrder.receiver_name ||
                            selectedOrder.shipping_address.name}
                        </p>
                        <p>{selectedOrder.shipping_address.address_line_1}</p>
                        {selectedOrder.shipping_address.address_line_2 && (
                          <p>{selectedOrder.shipping_address.address_line_2}</p>
                        )}
                        <p>
                          {selectedOrder.shipping_address.city},{" "}
                          {selectedOrder.shipping_address.state}{" "}
                          {selectedOrder.shipping_address.pincode}
                        </p>
                        {(selectedOrder.receiver_phone ||
                          selectedOrder.shipping_address.phone) && (
                          <p>
                            Phone:{" "}
                            {selectedOrder.receiver_phone ||
                              selectedOrder.shipping_address.phone}
                          </p>
                        )}
                        {(selectedOrder.alternate_phone ||
                          selectedOrder.shipping_address.alternate_phone) && (
                          <p>
                            Alternate Phone:{" "}
                            {selectedOrder.alternate_phone ||
                              selectedOrder.shipping_address.alternate_phone}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Delivery Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedOrder.delivery_date && (
                        <p>
                          <span className="font-medium">Delivery Date:</span>{" "}
                          {new Date(
                            selectedOrder.delivery_date,
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {selectedOrder.delivery_slot && (
                        <p>
                          <span className="font-medium">Time Slot:</span>{" "}
                          {selectedOrder.delivery_slot}
                        </p>
                      )}
                      {selectedOrder.tracking_number && (
                        <p>
                          <span className="font-medium">Tracking:</span>{" "}
                          {selectedOrder.tracking_number}
                        </p>
                      )}
                      {selectedOrder.special_instructions && (
                        <div>
                          <p className="font-medium">Special Instructions:</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedOrder.special_instructions}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Additional Order Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedOrder.customer_message && (
                        <div>
                          <p className="font-medium">Customer Message:</p>
                          <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                            {selectedOrder.customer_message}
                          </p>
                        </div>
                      )}
                      {selectedOrder.delivery_instructions && (
                        <div>
                          <p className="font-medium">Delivery Instructions:</p>
                          <p className="text-sm text-muted-foreground bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                            {selectedOrder.delivery_instructions}
                          </p>
                        </div>
                      )}
                      {selectedOrder.uploaded_files &&
                        selectedOrder.uploaded_files.length > 0 && (
                          <div>
                            <p className="font-medium">All Uploaded Files:</p>
                            <div className="space-y-3 mt-2">
                              {selectedOrder.uploaded_files.map(
                                (file: any, index: number) => (
                                  <div
                                    key={index}
                                    className="bg-gray-50 p-3 rounded-lg border"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                          {file.file_name}
                                        </p>
                                        <p className="text-sm text-blue-600">
                                          📦 Product: {file.product_name}
                                        </p>
                                        <div className="flex gap-4 mt-1">
                                          {file.file_size && (
                                            <p className="text-xs text-gray-500">
                                              📏 Size:{" "}
                                              {(
                                                file.file_size /
                                                1024 /
                                                1024
                                              ).toFixed(2)}{" "}
                                              MB
                                            </p>
                                          )}
                                          {file.file_type && (
                                            <p className="text-xs text-gray-500">
                                              📄 Type: {file.file_type}
                                            </p>
                                          )}
                                        </div>
                                        {file.file_url && (
                                          <div className="mt-2">
                                            <a
                                              href={file.file_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition-colors"
                                            >
                                              �� Download File
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                      <Badge
                                        variant={
                                          file.status === "uploaded"
                                            ? "default"
                                            : "destructive"
                                        }
                                        className={
                                          file.status === "uploaded"
                                            ? "bg-green-100 text-green-800"
                                            : ""
                                        }
                                      >
                                        {file.status}
                                      </Badge>
                                    </div>
                                    {file.error && (
                                      <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded">
                                        ❌ Error: {file.error}
                                      </p>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      {selectedOrder.notes && (
                        <div>
                          <p className="font-medium">Admin Notes:</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedOrder.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Payment Status</p>
                        <Badge
                          className={
                            selectedOrder.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {selectedOrder.payment_status.toUpperCase()}
                        </Badge>
                      </div>
                      {selectedOrder.payment_method && (
                        <div>
                          <p className="font-medium">Payment Method</p>
                          <p>{selectedOrder.payment_method}</p>
                        </div>
                      )}
                    </div>

                    {selectedOrder.payment_reference && (
                      <div>
                        <p className="font-medium">Payment Reference</p>
                        <p className="font-mono text-sm">
                          {selectedOrder.payment_reference}
                        </p>
                      </div>
                    )}

                    {selectedOrder.coupon_code && (
                      <div>
                        <p className="font-medium">Coupon Used</p>
                        <p>{selectedOrder.coupon_code}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Viewer Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              <DialogTitle>Product Image</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImage(null)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-4">
            {selectedImage && (
              <div className="flex justify-center">
                <img
                  src={selectedImage}
                  alt="Product"
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
