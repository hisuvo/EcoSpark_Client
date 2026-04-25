"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RejectFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedback: string) => void;
  isLoading: boolean;
}

export default function RejectFeedbackModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: RejectFeedbackModalProps) {
  const [feedback, setFeedback] = useState("");

  const handleConfirm = () => {
    if (!feedback.trim()) return;
    onConfirm(feedback);
    setFeedback("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject Idea</DialogTitle>
          <DialogDescription>
            Please provide feedback on why this idea is being rejected. This will
            be visible to the author.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="e.g., Lacks feasibility study, title is unclear..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !feedback.trim()}
          >
            {isLoading ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
