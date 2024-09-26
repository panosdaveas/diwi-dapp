import React from "react";
import { IconButton, Typography } from "@material-tailwind/react";
import { useCopyToClipboard } from "usehooks-ts";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export function ClipboardDefault({ content }) {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = React.useState(false);

  return (
    <div>
      <div className="flex items-center gap-x-4">
        <IconButton
          onMouseLeave={() => setCopied(false)}
          onClick={() => {
            copy(content);
            setCopied(true);
          }}
        >
          {copied ? (
            <CheckIcon className="h-5 w-5 text-white" />
          ) : (
            <DocumentDuplicateIcon className="h-5 w-5 text-blue-gray" />
          )}
        </IconButton>
      </div>
    </div>
  );
}
