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
import { useRouter } from "expo-router"; // Import the useRouter hook for navigation

const TMDB_API_KEY = "5138aa4ab2cae3c208f8a6aa6afe4e63";
const { width } = Dimensions.get("window"); // Get screen width

const HorrorMoviesScreen = () => {
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    // Fetch horror movies (genre ID 27)
    const fetchHorrorMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=27&page=1`
        );

        // Sort movies by release date (latest to oldest)
        const sortedMovies = response.data.results.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );

        // Limit the number of movies to show (for example, first 20)
        const limitedMovies = sortedMovies.slice(0, 20);
        setHorrorMovies(limitedMovies);
      } catch (error) {
        console.error("Error fetching horror movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHorrorMovies();
  }, []);

  const handleMoviePress = (movieId: number) => {
    // Navigate to the movie details page with the selected movieId
    router.push(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Horror Movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={horrorMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieCard}
            onPress={() => handleMoviePress(item.id)} // Use onPress for better feedback
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
};

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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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

export default HorrorMoviesScreen;
