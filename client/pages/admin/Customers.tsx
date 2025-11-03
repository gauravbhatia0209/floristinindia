import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  ShoppingBag,
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
import { Customer, Order } from "@shared/database.types";
import PermissionGuard from "@/components/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import { canEdit, canDelete } from "@/lib/permissionUtils";

interface CustomerWithOrders extends Customer {
  recent_orders?: Order[];
}

export default function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<CustomerWithOrders[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<
    CustomerWithOrders[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerWithOrders | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const hasEditPermission = canEdit(user?.permissions, "customers");
  const hasDeletePermission = canDelete(user?.permissions, "customers");

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery]);

  async function fetchCustomers() {
    try {
      const { data: customersData } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!customersData) {
        setIsLoading(false);
        return;
      }

      // Fetch orders to calculate customer totals
      const { data: ordersData } = await supabase
        .from("orders")
        .select("customer_id, total_amount");

      // Create a map of customer order totals
      const customerOrderMap: Record<
        string,
        { total_orders: number; total_spent: number }
      > = {};

      if (ordersData) {
        ordersData.forEach((order) => {
          if (!customerOrderMap[order.customer_id]) {
            customerOrderMap[order.customer_id] = {
              total_orders: 0,
              total_spent: 0,
            };
          }
          customerOrderMap[order.customer_id].total_orders++;
          customerOrderMap[order.customer_id].total_spent += order.total_amount;
        });
      }

      // Merge order data with customer data
      const enrichedCustomers = customersData.map((customer) => ({
        ...customer,
        total_orders:
          customerOrderMap[customer.id]?.total_orders ||
          customer.total_orders ||
          0,
        total_spent:
          customerOrderMap[customer.id]?.total_spent ||
          customer.total_spent ||
          0,
      }));

      setCustomers(enrichedCustomers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCustomerOrders(customerId: string) {
    try {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(10);

      return data || [];
    } catch (error) {
      console.error("Failed to fetch customer orders:", error);
      return [];
    }
  }

  function filterCustomers() {
    let filtered = customers;

    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.first_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.last_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (customer.phone &&
            customer.phone.includes(searchQuery.toLowerCase())),
      );
    }

    setFilteredCustomers(filtered);
  }

  async function handleCustomerClick(customer: CustomerWithOrders) {
    const orders = await fetchCustomerOrders(customer.id);
    setSelectedCustomer({ ...customer, recent_orders: orders });
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getCustomerTier(totalSpent: number) {
    if (totalSpent >= 10000) return { tier: "Gold", color: "bg-yellow-500" };
    if (totalSpent >= 5000) return { tier: "Silver", color: "bg-gray-400" };
    if (totalSpent >= 1000) return { tier: "Bronze", color: "bg-orange-600" };
    return { tier: "New", color: "bg-blue-500" };
  }

  function exportCustomersToCSV() {
    const csvHeaders = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Total Orders",
      "Total Spent",
      "Email Verified",
      "Phone Verified",
      "Created At",
    ];

    const csvData = customers.map((customer) => [
      customer.id,
      customer.first_name || "",
      customer.last_name || "",
      customer.email,
      customer.phone || "",
      customer.total_orders || 0,
      customer.total_spent || 0,
      customer.email_verified ? "Yes" : "No",
      customer.phone_verified ? "Yes" : "No",
      new Date(customer.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvData.map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell);
            return cellStr.includes(",") ? `"${cellStr}"` : cellStr;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `customers-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    total: customers.length,
    verified: customers.filter((c) => c.email_verified && c.phone_verified)
      .length,
    active: customers.filter((c) => c.is_active).length,
    totalSpent: customers.reduce((sum, c) => sum + c.total_spent, 0),
    avgOrderValue:
      customers.reduce((sum, c) => sum + c.total_spent, 0) /
        customers.reduce((sum, c) => sum + c.total_orders, 0) || 0,
  };

  return (
    <PermissionGuard requiredModule="customers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground">
              View and manage customer information
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCustomersToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {stats.verified}
                </p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.active}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  ₹{stats.totalSpent.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  ₹{Math.round(stats.avgOrderValue).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => {
                const tierInfo = getCustomerTier(customer.total_spent);
                return (
                  <div
                    key={customer.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleCustomerClick(customer)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-rose rounded-full flex items-center justify-center text-white font-semibold">
                            {customer.first_name.charAt(0)}
                            {customer.last_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {customer.first_name} {customer.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {customer.email}
                            </p>
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full ${tierInfo.color}`}
                            title={`${tierInfo.tier} Customer`}
                          ></div>
                          <Badge variant="outline" className="text-xs">
                            {tierInfo.tier}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {customer.phone || "No phone"}
                              {customer.phone_verified && (
                                <Badge
                                  variant="outline"
                                  className="ml-1 text-xs"
                                >
                                  ✓
                                </Badge>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {customer.total_orders} orders • ₹
                              {customer.total_spent.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              Joined {formatDate(customer.created_at)}
                              {customer.last_order_date && (
                                <span className="text-muted-foreground">
                                  {" "}
                                  • Last order{" "}
                                  {formatDate(customer.last_order_date)}
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                customer.is_active ? "default" : "secondary"
                              }
                            >
                              {customer.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {customer.email_verified && (
                              <Badge variant="outline" className="text-xs">
                                Email ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Customer Details Dialog */}
        <Dialog
          open={!!selectedCustomer}
          onOpenChange={() => setSelectedCustomer(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Customer Details -{" "}
                {selectedCustomer &&
                  `${selectedCustomer.first_name} ${selectedCustomer.last_name}`}
              </DialogTitle>
            </DialogHeader>

            {selectedCustomer && (
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Full Name</p>
                          <p>
                            {selectedCustomer.first_name}{" "}
                            {selectedCustomer.last_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <div className="flex items-center gap-2">
                            <p>{selectedCustomer.email}</p>
                            {selectedCustomer.email_verified && (
                              <Badge variant="outline" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        {selectedCustomer.phone && (
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <div className="flex items-center gap-2">
                              <p>{selectedCustomer.phone}</p>
                              {selectedCustomer.phone_verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        {selectedCustomer.gender && (
                          <div>
                            <p className="text-sm font-medium">Gender</p>
                            <p className="capitalize">
                              {selectedCustomer.gender}
                            </p>
                          </div>
                        )}
                        {selectedCustomer.date_of_birth && (
                          <div>
                            <p className="text-sm font-medium">Date of Birth</p>
                            <p>{formatDate(selectedCustomer.date_of_birth)}</p>
                          </div>
                        )}
                        {selectedCustomer.anniversary_date && (
                          <div>
                            <p className="text-sm font-medium">Anniversary</p>
                            <p>
                              {formatDate(selectedCustomer.anniversary_date)}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Account Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Customer Since</p>
                          <p>{formatDate(selectedCustomer.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total Orders</p>
                          <p className="text-2xl font-bold">
                            {selectedCustomer.total_orders}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total Spent</p>
                          <p className="text-2xl font-bold">
                            ₹{selectedCustomer.total_spent.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Average Order Value
                          </p>
                          <p className="text-xl font-semibold">
                            ₹
                            {selectedCustomer.total_orders > 0
                              ? Math.round(
                                  selectedCustomer.total_spent /
                                    selectedCustomer.total_orders,
                                ).toLocaleString()
                              : 0}
                          </p>
                        </div>
                        {selectedCustomer.last_order_date && (
                          <div>
                            <p className="text-sm font-medium">Last Order</p>
                            <p>
                              {formatDate(selectedCustomer.last_order_date)}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">Customer Tier</p>
                          <Badge
                            className={
                              getCustomerTier(selectedCustomer.total_spent)
                                .color + " text-white"
                            }
                          >
                            {getCustomerTier(selectedCustomer.total_spent).tier}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedCustomer.recent_orders &&
                      selectedCustomer.recent_orders.length > 0 ? (
                        <div className="space-y-4">
                          {selectedCustomer.recent_orders.map((order) => (
                            <div
                              key={order.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">
                                    #{order.order_number}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(order.created_at)}
                                  </p>
                                  <p className="text-sm">
                                    {order.items.length} item
                                    {order.items.length !== 1 ? "s" : ""}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">
                                    ₹{order.total_amount.toLocaleString()}
                                  </p>
                                  <Badge className="text-xs">
                                    {order.status.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No orders found
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="addresses" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Addresses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedCustomer.addresses &&
                      selectedCustomer.addresses.length > 0 ? (
                        <div className="space-y-4">
                          {selectedCustomer.addresses.map(
                            (address: any, index: number) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">
                                      {address.name}
                                    </p>
                                    <p className="text-sm">
                                      {address.address_line_1}
                                    </p>
                                    {address.address_line_2 && (
                                      <p className="text-sm">
                                        {address.address_line_2}
                                      </p>
                                    )}
                                    <p className="text-sm">
                                      {address.city}, {address.state}{" "}
                                      {address.pincode}
                                    </p>
                                    {address.phone && (
                                      <p className="text-sm text-muted-foreground">
                                        Phone: {address.phone}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No saved addresses
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedCustomer.preferences ? (
                        <div className="space-y-3">
                          {Object.entries(selectedCustomer.preferences).map(
                            ([key, value]: [string, any]) => (
                              <div key={key}>
                                <p className="text-sm font-medium capitalize">
                                  {key.replace(/_/g, " ")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {typeof value === "boolean"
                                    ? value
                                      ? "Yes"
                                      : "No"
                                    : String(value)}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No preferences set
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}
