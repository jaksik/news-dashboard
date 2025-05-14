

'use client';

import withAuth from "@/components/withAuth";
import { ArticleManager } from "@/components/ArticleManager";

function Page() {
  return (
    <div>
      <ArticleManager />
    </div>
  );
}

export default withAuth(Page, "Manage Articles");