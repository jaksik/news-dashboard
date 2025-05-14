

'use client';

import withAuth from "@/components/withAuth";
import ToolCreator from "@/components/ToolCreator";

function Page() {
  return (
    <div>
      <ToolCreator />
    </div>
  );
}

export default withAuth(Page, "Create Tool");