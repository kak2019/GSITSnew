import React, { useState } from "react";
import {
    Dialog,
    DialogFooter,
    DialogType,
    PrimaryButton,
    DefaultButton,
    TextField,
} from "@fluentui/react";

interface ReturnDialogProps {
    isOpen: boolean;
    onDismiss: () => void;
    onConfirm: (comments: string) => void;
}

const ReturnDialog: React.FC<ReturnDialogProps> = ({ isOpen, onDismiss, onConfirm }) => {
    const [comments, setComments] = useState("");

    return (
        <Dialog
            hidden={!isOpen}
            onDismiss={onDismiss}
            dialogContentProps={{
                type: DialogType.normal,
                title: "Return Request",
            }}
            minWidth={800}
            maxWidth={1200}
        >
            <TextField
                label="Return Comments"
                multiline
                rows={3}
                required
                value={comments}
                onChange={(e, newValue) => setComments(newValue || "")}
            />
            <DialogFooter>
                <DefaultButton onClick={onDismiss} text="Cancel" />
                <PrimaryButton onClick={() => onConfirm(comments)} text="OK" />
            </DialogFooter>
        </Dialog>
    );
};

export default ReturnDialog;
