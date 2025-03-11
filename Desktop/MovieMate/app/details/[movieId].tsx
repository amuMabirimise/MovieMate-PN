import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import axios from "axios";
import React, { useEffect, useState } from "react";

// Get device screen dimensions
const { width, height } = Dimensions.get("window");
const videoHeight = height * 0.3; // Adjust video height (30% of screen height)

const TMDB_HEADERS = {
  Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTM4YWE0YWIyY2FlM2MyMDhmOGE2YWE2YWZlNGU2MyIsIm5iZiI6MTc0MTEyNDE2OC43ODQsInN1YiI6IjY3Yzc3MjQ4MjZiNGUxOTZiMWYwNzI3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yXsJxjkvjJcAOniGVNi4HnibBl_IqQVL1zdu9QT8CwY`, // Replace with your own API key
  "Content-Type": "application/json",
};

const MovieDetailsScreen = () => {
  const { movieId } = useLocalSearchParams(); // Access the movieId parameter from the URL
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch movie details
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          { headers: TMDB_HEADERS }
        );
        setMovie(response.data);

        // Fetch trailer videos
        const videoResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos`,
          { headers: TMDB_HEADERS }
        );

        // Find a YouTube trailer
        const trailer = videoResponse.data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        if (trailer) {
          setVideoKey(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text>Movie not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.moviePoster}
      />
      <Text style={styles.movieTitle}>{movie.title}</Text>
      <Text style={styles.movieOverview}>{movie.overview}</Text>
      <Text style={styles.movieReleaseDate}>
        Release Date: {movie.release_date}
      </Text>

      {/* Video Trailer (YouTube Embed with better display size) */}
      {videoKey ? (
        <WebView
          source={{
            uri: `https://www.youtube.com/embed/${videoKey}?autoplay=1`, // Autoplay for better engagement
          }}
          style={[styles.webView, { width: width, height: videoHeight }]} // Full width & 30% of screen height
        />
      ) : (
        <Text style={styles.noTrailerText}>No trailer available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  moviePoster: { width: 300, height: 450, borderRadius: 8 },
  movieTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  movieOverview: { fontSize: 16, marginTop: 10, textAlign: "center" },
  movieReleaseDate: {
    fontSize: 14,
    color: "#777",
    marginTop: 10,
    textAlign: "center",
  },
  webView: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 20,
  },
  noTrailerText: {
    fontSize: 16,
    color: "#ff0000",
    marginTop: 10,
  },
});

export default MovieDetailsScreen;
