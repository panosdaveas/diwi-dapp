import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";
import React from "react";
import { useCopyToClipboard } from "usehooks-ts";

export function ClipboardDefault({ content }) {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = React.useState(false);

  return (
    <div>
      <div className="flex items-center gap-x-4">
        <IconButton variant="text"
          className="text-content"
          size="sm"
          onMouseLeave={() => setCopied(false)}
          onClick={() => {
            copy(content);
            setCopied(true);
          }}
        >
          {copied ? (
            <CheckIcon className="h-5 w-5 text-blue-gray" />
          ) : (
            <DocumentDuplicateIcon className="h-5 w-5 text-blue-gray" />
          )}
        </IconButton>
      </div>
    </div>
  );
}
