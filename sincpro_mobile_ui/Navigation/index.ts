import AppBar from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import BottomNav from "@sincpro/mobile-ui/Navigation/Navigation.BottomNav";
import CollapsingHeader from "@sincpro/mobile-ui/Navigation/Navigation.CollapsingHeader";
import FloatingBar from "@sincpro/mobile-ui/Navigation/Navigation.FloatingBar";
import Menu from "@sincpro/mobile-ui/Navigation/Navigation.Menu";
import { MenuSection } from "@sincpro/mobile-ui/Navigation/Navigation.MenuSection";
import RowItem from "@sincpro/mobile-ui/Navigation/Navigation.RowItem";
import Search from "@sincpro/mobile-ui/Navigation/Navigation.Search";
import SearchBar from "@sincpro/mobile-ui/Navigation/Navigation.SearchBar";
import SearchSuggestions from "@sincpro/mobile-ui/Navigation/Navigation.SearchSuggestions";
import SegmentedControl from "@sincpro/mobile-ui/Navigation/Navigation.SegmentedControl";
import Steps from "@sincpro/mobile-ui/Navigation/Navigation.Steps";
import Tabs from "@sincpro/mobile-ui/Navigation/Navigation.Tabs";
export type { AppBarBackground } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
export type { MenuSectionProps } from "@sincpro/mobile-ui/Navigation/Navigation.MenuSection";
export type {
  SearchFilterSheetProps,
  SearchFiltersProps,
  SearchRootProps,
} from "@sincpro/mobile-ui/Navigation/Navigation.Search";
export type { SearchBarProps } from "@sincpro/mobile-ui/Navigation/Navigation.SearchBar";
export type {
  SearchSuggestion,
  SearchSuggestionsProps,
} from "@sincpro/mobile-ui/Navigation/Navigation.SearchSuggestions";

export const Navigation = {
  AppBar,
  BottomNav,
  CollapsingHeader,
  FloatingBar,
  SearchBar,
  Search,
  SearchSuggestions,
  RowItem,
  SegmentedControl,
  Tabs,
  Menu,
  MenuSection,
  Steps,
};

export default Navigation;
