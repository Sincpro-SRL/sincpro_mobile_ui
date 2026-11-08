import { expect, jest, test } from "@jest/globals";
import SearchBar from "@sincpro/mobile-ui/Navigation/Navigation.SearchBar";
import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

test("the query uses the native search size and can take the field size instead", async () => {
  const { rerender } = await render(<SearchBar onChangeText={jest.fn()} value="café" />);
  expect(StyleSheet.flatten(screen.getByLabelText("Buscar").props.style).fontSize).toBe(17);

  await rerender(<SearchBar onChangeText={jest.fn()} textVariant="body" value="café" />);
  expect(StyleSheet.flatten(screen.getByLabelText("Buscar").props.style).fontSize).toBe(14);
});
