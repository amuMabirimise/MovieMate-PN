import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="popular" options={{ title: "Popular Movies" }} />
      <Stack.Screen name="action" options={{ title: "Action Movies" }} />
      <Stack.Screen name="horror" options={{ title: "Horror Movies" }} />
      <Stack.Screen
        name="details/[movieId]"
        options={{ title: "Movie Details" }}
      />
    </Stack>
  );
}
