import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy'; // Match your import syntax
import * as MediaLibrary from 'expo-media-library';
import { supabase } from '../services/supabaseClient';
import { styles } from '../styles/globalStyles';
import { SprintMetrics } from '../types/index';

// 🚀 CLEAN ARCHITECTURE: The screen manages its own local state now
export const AnalyzerScreen: React.FC<{ user: any }> = ({ user }) => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1.0);
  const [metrics, setMetrics] = useState<SprintMetrics>({
    reaction_time: null,
    whistle_time: null,
    launch_angle: null,
    knee_angle: null
  });

  // Setup the video player hook directly inside the component
  const player = useVideoPlayer(videoUri, (playerInstance) => {
    playerInstance.loop = false;
  });

  const changePlaybackSpeed = (speed: number) => {
    setCurrentSpeed(speed);
    player.playbackRate = speed;
  };

  // 1. Pick a Video (Clears old metrics to prevent frozen buttons!)
  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // 🧠 FIXED THE BUG HERE: Reset everything from the previous run immediately
      setMetrics({
        reaction_time: null,
        whistle_time: null,
        launch_angle: null,
        knee_angle: null
      });
      setVideoUri(result.assets[0].uri);
    }
  };

  // 2. Upload Video and Commit to Backend + Supabase
  const uploadVideo = async () => {
    if (!videoUri) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('video_file', {
        uri: videoUri,
        name: 'sprint_video.mp4',
        type: 'video/mp4',
      } as any);

      const response = await fetch('http://192.168.86.111:8000/analyze-sprint/', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        // Update local metrics display state
        setMetrics({
          reaction_time: data.reaction_time,
          whistle_time: data.whistle_time,
          launch_angle: data.launch_angle,
          knee_angle: data.knee_angle,
        });

        // Push clean metrics straight to your remote database
        const { error: dbError } = await supabase.from('sprint_logs').insert([
          {
            user_id: user?.id,
            date: new Date().toLocaleDateString(),
            reaction_time: data.reaction_time,
            whistle_time: data.whistle_time,
            launch_angle: data.launch_angle,
            knee_angle: data.knee_angle,
            hand_drop_dist: data.hand_drop_dist,
          },
        ]);

        if (dbError) throw dbError;
        Alert.alert("Success", "Analysis saved completely!");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Analysis Error", err.message || "Failed to process video.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Download Or Save Video Out into local storage
  const downloadOrSaveVideo = async () => {
    if (!videoUri) return;
    setDownloading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Storage access required to save clips.");
        return;
      }

      let fileToSaveUri = videoUri;
      if (videoUri.startsWith('http')) {
        const filename = `analyzed_sprint_${Date.now()}.mp4`;
        const targetPath = FileSystem.documentDirectory + filename;
        const downloadResult = await FileSystem.downloadAsync(videoUri, targetPath);
        fileToSaveUri = downloadResult.uri;
      }
      await MediaLibrary.saveToLibraryAsync(fileToSaveUri);
      Alert.alert("Saved!", "Video saved to photo library!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to compile file output.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <View style={styles.videoContainer}>
        {videoUri ? (
          <>
            <VideoView
              style={styles.videoPlayer}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
            <View style={styles.floatingSpeedContainer}>
              {[0.25, 0.5, 1.0, 2.0].map((speed) => (
                <TouchableOpacity
                  key={speed}
                  style={[styles.floatingSpeedButton, currentSpeed === speed && styles.activeFloatingButton]}
                  onPress={() => changePlaybackSpeed(speed)}
                >
                  <Text style={styles.floatingSpeedText}>{speed}x</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.placeholderBox}>No Sprint Video Selected</Text>
        )}
      </View>

      {/* Numerical Data Board Cards */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Reaction Time</Text>
          <Text style={styles.metricValue}>
            {metrics.reaction_time ? `${metrics.reaction_time} ms` : 'N/A'}
          </Text>
        </View>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Launch Angle</Text>
          <Text style={styles.metricValue}>
            {metrics.launch_angle ? `${metrics.launch_angle}°` : 'N/A'}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Knee Angle</Text>
          <Text style={styles.metricValue}>
            {metrics.knee_angle ? `${metrics.knee_angle}°` : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Dynamic Action Buttons Section */}
      <View style={styles.content}>
        {loading || downloading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : !videoUri ? (
          <TouchableOpacity style={styles.button} onPress={pickVideo}>
            <Text style={styles.buttonText}>Select Sprint Video</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButtonGroup}>
            {!metrics.reaction_time ? (
              <TouchableOpacity style={[styles.button, styles.analyzeButton]} onPress={uploadVideo}>
                <Text style={styles.buttonText}>Run AI Analysis</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.button, styles.downloadButton]} onPress={downloadOrSaveVideo}>
                <Text style={styles.buttonText}>Save Video to Gallery</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.resetLink} onPress={pickVideo}>
              <Text style={styles.resetLinkText}>Choose a different video</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};