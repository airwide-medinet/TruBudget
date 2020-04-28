import Drawer from "@material-ui/core/Drawer";
import React from "react";

import ScrollingHistory from "./ScrollingHistory";

export default function HistoryDrawer({
  doShow,
  onClose,
  events,
  nEventsTotal,
  fetchNext,
  hasMore,
  isLoading,
  getUserDisplayname,
  permissionLevel,
  storePermissionSelected,
  selectedPermission
}) {
  return (
    <Drawer open={doShow} onClose={onClose} anchor="right">
      <ScrollingHistory
        events={events}
        nEventsTotal={nEventsTotal}
        hasMore={hasMore}
        isLoading={isLoading}
        getUserDisplayname={getUserDisplayname}
        fetchNext={fetchNext}
        permissionLevel={permissionLevel}
        storePermissionSelected={storePermissionSelected}
        selectedPermission={selectedPermission}
      />
    </Drawer>
  );
}
