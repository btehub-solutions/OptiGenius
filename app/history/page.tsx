"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

type SavedReport = {
  id: string;
  url: string;
  title: string;
  score: number;
  createdAt: string;
};

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/history");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchReports();
    }
  }, [status]);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch reports");
      }
      
      setReports(data.reports);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete report");
      }

      setReports(reports.filter(r => r.id !== reportId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (status === "loading" || loading) {
    return (
      <main className="container py-10">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analysis History</h1>
        <p className="text-gray-600 mt-2">View and manage your saved reports</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-600 mb-4">No saved reports yet</p>
            <Link href="/">
              <Button>Analyze Your First URL</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {report.title || "Untitled"}
                    </h3>
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {report.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>
                        Score: <span className={`font-bold ${getScoreColor(report.score)}`}>
                          {report.score}
                        </span>
                      </span>
                      <span>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
