

'use client';

import withAuth from "@/components/withAuth";
import { NewsCreator } from "@/components/NewsCreator";

function Page() {
  return (
    <div>
      <NewsCreator />
    </div>
  );
}

export default withAuth(Page, "Create News");