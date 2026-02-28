import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { DashboardPage } from "./components/dashboard-page-live";
import { SourcesPage } from "./components/sources-page";
import { ChangesFeedPage } from "./components/changes-feed-page";
import { ChangeDetailPage } from "./components/change-detail-page";
import { SettingsPage } from "./components/settings-page";
import { SystemStatusPage } from "./components/system-status-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "sources", Component: SourcesPage },
      { path: "changes", Component: ChangesFeedPage },
      { path: "changes/:id", Component: ChangeDetailPage },
      { path: "settings", Component: SettingsPage },
      { path: "system-status", Component: SystemStatusPage },
    ],
  },
]);
