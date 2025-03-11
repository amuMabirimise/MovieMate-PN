import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";

const TMDB_API_KEY = "5138aa4ab2cae3c208f8a6aa6afe4e63";
const { width, height } = Dimensions.get("window");

const PopularMoviesScreen = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Use router for navigation

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );

        const sortedMovies = response.data.results.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );

        setPopularMovies(sortedMovies.slice(0, 20));
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Popular Movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={popularMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/details/${item.id}`)}>
            <View style={styles.movieCard}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                }}
                style={styles.moviePoster}
              />
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.movieReleaseDate}>{item.release_date}</Text>
            </View>
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
  movieCard: {
    flex: 1,
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  moviePoster: {
    width: width / 2 - 20, // Half the screen width minus some padding for responsiveness
    height: height * 0.25, // Responsive height (25% of screen height)
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

export default PopularMoviesScreen;
