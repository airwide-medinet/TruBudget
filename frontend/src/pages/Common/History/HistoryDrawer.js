import Drawer from "@material-ui/core/Drawer";
import React from "react";

import ScrollingHistory from "./ScrollingHistory";

export default function HistoryDrawer({
  doShow,
  onClose,
  events,
  resetHistory,
  nEventsTotal,
  fetchNext,
  hasMore,
  isLoading,
  getUserDisplayname,
  permissionLevel,
  storePermissionSelected,
  selectedPermission,
  storeHistoryStartDate,
  searchHistoryStartDate,
  storeHistoryEndDate,
  searchHistoryEndDate,
  storeHistorySearchName,
  searchHistoryName
}) {
  return (
    <Drawer open={doShow} onClose={onClose} anchor="right">
      <ScrollingHistory
        events={events}
        resetHistory={resetHistory}
        nEventsTotal={nEventsTotal}
        hasMore={hasMore}
        isLoading={isLoading}
        getUserDisplayname={getUserDisplayname}
        fetchNext={fetchNext}
        permissionLevel={permissionLevel}
        storePermissionSelected={storePermissionSelected}
        selectedPermission={selectedPermission}
        storeHistoryStartDate={storeHistoryStartDate}
        searchHistoryStartDate={searchHistoryStartDate}
        storeHistoryEndDate={storeHistoryEndDate}
        searchHistoryEndDate={searchHistoryEndDate}
        storeHistorySearchName={storeHistorySearchName}
        searchHistoryName={searchHistoryName}
      />
    </Drawer>
  );
}
