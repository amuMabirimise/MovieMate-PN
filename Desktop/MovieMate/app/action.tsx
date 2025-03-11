import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";

const TMDB_API_KEY = "5138aa4ab2cae3c208f8a6aa6afe4e63"; // Your API Key
const { width } = Dimensions.get("window"); // Get screen width

export default function ActionScreen() {
  const [actionMovies, setActionMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch action movies
    const fetchActionMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&language=en-US&page=1`
        );

        // Sort movies by release date (latest to oldest)
        const sortedMovies = response.data.results.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );

        setActionMovies(sortedMovies.slice(0, 20)); // Limit to 20 movies
      } catch (error) {
        console.error("Error fetching action movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActionMovies();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Action Movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={actionMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieCard}
            onPress={() => router.push(`/details/${item.id}`)} // Navigate to MovieDetailsScreen
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              }}
              style={styles.moviePoster}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.movieReleaseDate}>{item.release_date}</Text>
          </TouchableOpacity>
        )}
        numColumns={2} // Display in 2 columns
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  movieCard: {
    flex: 1,
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    padding: 10,
    alignItems: "center",
    marginHorizontal: 5, // Space between columns
  },
  moviePoster: {
    width: width / 2 - 20, // Adjust width based on screen size
    height: 225,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  movieReleaseDate: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
