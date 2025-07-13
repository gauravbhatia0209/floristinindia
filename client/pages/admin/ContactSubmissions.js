"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactSubmissions;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var table_1 = require("@/components/ui/table");
var dialog_1 = require("@/components/ui/dialog");
var supabase_1 = require("@/lib/supabase");
function ContactSubmissions() {
    var _a = (0, react_1.useState)([]), submissions = _a[0], setSubmissions = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), selectedSubmission = _c[0], setSelectedSubmission = _c[1];
    var _d = (0, react_1.useState)(false), isDialogOpen = _d[0], setIsDialogOpen = _d[1];
    (0, react_1.useEffect)(function () {
        fetchSubmissions();
    }, []);
    function fetchSubmissions() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("contact_submissions")
                                .select("*")
                                .order("submitted_at", { ascending: false })];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            setSubmissions(data);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch contact submissions:", error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function markAsRead(submissionId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("contact_submissions")
                                .update({ is_read: true })
                                .eq("id", submissionId)];
                    case 1:
                        _a.sent();
                        setSubmissions(submissions.map(function (sub) {
                            return sub.id === submissionId ? __assign(__assign({}, sub), { is_read: true }) : sub;
                        }));
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Failed to mark as read:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function deleteSubmission(submissionId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this submission?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("contact_submissions")
                                .delete()
                                .eq("id", submissionId)];
                    case 2:
                        _a.sent();
                        setSubmissions(submissions.filter(function (sub) { return sub.id !== submissionId; }));
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Failed to delete submission:", error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function viewSubmission(submission) {
        setSelectedSubmission(submission);
        setIsDialogOpen(true);
        if (!submission.is_read) {
            markAsRead(submission.id);
        }
    }
    var unreadCount = submissions.filter(function (sub) { return !sub.is_read; }).length;
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Contact Submissions</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and messages
          </p>
        </div>
        {unreadCount > 0 && (<badge_1.Badge variant="destructive" className="text-sm">
            {unreadCount} unread
          </badge_1.Badge>)}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Total Submissions
            </card_1.CardTitle>
            <lucide_react_1.MessageSquare className="h-4 w-4 text-muted-foreground"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Unread</card_1.CardTitle>
            <lucide_react_1.Mail className="h-4 w-4 text-red-600"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Read</card_1.CardTitle>
            <lucide_react_1.Eye className="h-4 w-4 text-green-600"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">
              {submissions.length - unreadCount}
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">This Month</card_1.CardTitle>
            <lucide_react_1.Calendar className="h-4 w-4 text-blue-600"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter(function (sub) {
            var submissionDate = new Date(sub.submitted_at);
            var now = new Date();
            return (submissionDate.getMonth() === now.getMonth() &&
                submissionDate.getFullYear() === now.getFullYear());
        }).length}
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Submissions Table */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>All Submissions</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          {submissions.length === 0 ? (<div className="text-center py-12">
              <lucide_react_1.MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground">
                Contact form submissions will appear here
              </p>
            </div>) : (<div className="overflow-x-auto">
              <table_1.Table>
                <table_1.TableHeader>
                  <table_1.TableRow>
                    <table_1.TableHead>Status</table_1.TableHead>
                    <table_1.TableHead>Name</table_1.TableHead>
                    <table_1.TableHead>Email</table_1.TableHead>
                    <table_1.TableHead>Subject</table_1.TableHead>
                    <table_1.TableHead>Date</table_1.TableHead>
                    <table_1.TableHead className="w-12"></table_1.TableHead>
                  </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                  {submissions.map(function (submission) { return (<table_1.TableRow key={submission.id} className={!submission.is_read ? "bg-blue-50" : ""}>
                      <table_1.TableCell>
                        <badge_1.Badge variant={submission.is_read ? "secondary" : "destructive"}>
                          {submission.is_read ? "Read" : "Unread"}
                        </badge_1.Badge>
                      </table_1.TableCell>
                      <table_1.TableCell className="font-medium">
                        {submission.name}
                      </table_1.TableCell>
                      <table_1.TableCell>
                        <a href={"mailto:".concat(submission.email)} className="text-blue-600 hover:underline">
                          {submission.email}
                        </a>
                      </table_1.TableCell>
                      <table_1.TableCell>
                        <div className="max-w-xs truncate">
                          {submission.subject}
                        </div>
                      </table_1.TableCell>
                      <table_1.TableCell>
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </table_1.TableCell>
                      <table_1.TableCell>
                        <div className="flex items-center gap-2">
                          <button_1.Button variant="ghost" size="icon" onClick={function () { return viewSubmission(submission); }}>
                            <lucide_react_1.Eye className="h-4 w-4"/>
                          </button_1.Button>
                          <button_1.Button variant="ghost" size="icon" onClick={function () { return deleteSubmission(submission.id); }}>
                            <lucide_react_1.Trash2 className="h-4 w-4 text-red-600"/>
                          </button_1.Button>
                        </div>
                      </table_1.TableCell>
                    </table_1.TableRow>); })}
                </table_1.TableBody>
              </table_1.Table>
            </div>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Submission Detail Dialog */}
      <dialog_1.Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <dialog_1.DialogContent className="max-w-2xl">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Contact Submission Details</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          {selectedSubmission && (<div className="space-y-4">
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
                    <a href={"mailto:".concat(selectedSubmission.email)} className="text-blue-600 hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </p>
                </div>
              </div>

              {selectedSubmission.phone && (<div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p>
                    <a href={"tel:".concat(selectedSubmission.phone)} className="text-blue-600 hover:underline">
                      {selectedSubmission.phone}
                    </a>
                  </p>
                </div>)}

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
                <button_1.Button variant="outline" onClick={function () { return setIsDialogOpen(false); }}>
                  Close
                </button_1.Button>
                <button_1.Button asChild>
                  <a href={"mailto:".concat(selectedSubmission.email, "?subject=Re: ").concat(selectedSubmission.subject)}>
                    Reply via Email
                  </a>
                </button_1.Button>
              </div>
            </div>)}
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
