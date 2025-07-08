import { useState, useEffect } from "react";
import {
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { ContactSubmission } from "@shared/database.types";

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      const { data } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (data) {
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Failed to fetch contact submissions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function markAsRead(submissionId: string) {
    try {
      await supabase
        .from("contact_submissions")
        .update({ is_read: true })
        .eq("id", submissionId);

      setSubmissions(
        submissions.map((sub) =>
          sub.id === submissionId ? { ...sub, is_read: true } : sub,
        ),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }

  async function deleteSubmission(submissionId: string) {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", submissionId);

      setSubmissions(submissions.filter((sub) => sub.id !== submissionId));
    } catch (error) {
      console.error("Failed to delete submission:", error);
    }
  }

  function viewSubmission(submission: ContactSubmission) {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);

    if (!submission.is_read) {
      markAsRead(submission.id);
    }
  }

  const unreadCount = submissions.filter((sub) => !sub.is_read).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Contact Submissions</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and messages
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Mail className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.length - unreadCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                submissions.filter((sub) => {
                  const submissionDate = new Date(sub.submitted_at);
                  const now = new Date();
                  return (
                    submissionDate.getMonth() === now.getMonth() &&
                    submissionDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground">
                Contact form submissions will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow
                      key={submission.id}
                      className={!submission.is_read ? "bg-blue-50" : ""}
                    >
                      <TableCell>
                        <Badge
                          variant={
                            submission.is_read ? "secondary" : "destructive"
                          }
                        >
                          {submission.is_read ? "Read" : "Unread"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {submission.name}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${submission.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {submission.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {submission.subject}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => viewSubmission(submission)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSubmission(submission.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p>
                    <a
                      href={`mailto:${selectedSubmission.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedSubmission.email}
                    </a>
                  </p>
                </div>
              </div>

              {selectedSubmission.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p>
                    <a
                      href={`tel:${selectedSubmission.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedSubmission.phone}
                    </a>
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Subject
                </label>
                <p className="font-medium">{selectedSubmission.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Message
                </label>
                <div className="mt-1 p-3 bg-gray-50 rounded border">
                  <p className="whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Submitted
                </label>
                <p>
                  {new Date(selectedSubmission.submitted_at).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button asChild>
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                  >
                    Reply via Email
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
