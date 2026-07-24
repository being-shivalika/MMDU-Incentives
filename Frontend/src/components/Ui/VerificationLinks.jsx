import React from "react";
import Card from "./Card";
import Button from "./Button";

const VerificationLinks = ({ links = [] }) => {
  if (!links || links.length === 0) return null;

  return (
    <Card className="p-6 shadow-sm border border-gray-100 bg-white">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Verification Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((linkItem, idx) => {
          if (!linkItem.url || !linkItem.url.startsWith("https://")) return null;
          return (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
              <div>
                <p className="font-medium text-gray-800 text-sm">{linkItem.title}</p>
                <p className="text-xs text-gray-500">{linkItem.type}</p>
              </div>
              <a 
                href={linkItem.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="text-xs px-3 py-1">
                  Open Link
                </Button>
              </a>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default VerificationLinks;
