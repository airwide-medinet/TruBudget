import { fromJS } from "immutable";
import { CLOSE_WORKFLOWITEM_DETAILS } from "../actions";
import {
  FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE,
  FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE_SUCCESS,
  RESET_WORKFLOWITEM_HISTORY,
  SET_TOTAL_WORKFLOWITEM_HISTORY_ITEM_COUNT,
  STORE_WORKFLOWITEM_HISTORY_SEARCH_START_DATE,
  STORE_WORKFLOWITEM_HISTORY_SEARCH_END_DATE,
  STORE_WORKFLOWITEM_HISTORY_SEARCH_NAME
} from "./actions";

const historyPageSize = 30;

const defaultState = fromJS({
  historyItems: [],
  totalHistoryItemCount: 0,
  historyPageSize: historyPageSize,
  currentHistoryPage: 0,
  lastHistoryPage: 1,
  isHistoryLoading: false,
  searchHistoryStartDate: "",
  searchHistoryEndDate: "",
  searchHistoryName: ""
});

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE:
      return state.set("isHistoryLoading", true);

    case SET_TOTAL_WORKFLOWITEM_HISTORY_ITEM_COUNT:
      return state.merge({
        totalHistoryItemCount: action.totalHistoryItemsCount,
        lastHistoryPage: action.lastHistoryPage
      });

    case FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE_SUCCESS:
      return state.merge({
        historyItems: state.get("historyItems").concat(fromJS(action.events).reverse()),
        currentHistoryPage: action.currentHistoryPage,
        isHistoryLoading: false
      });

    case STORE_WORKFLOWITEM_HISTORY_SEARCH_START_DATE:
      return state.set("searchHistoryStartDate", fromJS(action.searchHistoryStartDate));
    case STORE_WORKFLOWITEM_HISTORY_SEARCH_END_DATE:
      return state.set("searchHistoryEndDate", fromJS(action.searchHistoryEndDate));
    case STORE_WORKFLOWITEM_HISTORY_SEARCH_NAME:
      return state.set("searchHistoryName", fromJS(action.searchHistoryName));

    case RESET_WORKFLOWITEM_HISTORY:
    case CLOSE_WORKFLOWITEM_DETAILS:
      return defaultState;
    default:
      return state;
  }
}
