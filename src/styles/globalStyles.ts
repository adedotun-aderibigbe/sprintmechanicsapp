import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214', 
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    fontSize: 40,
    marginBottom: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#a1a1aa',
    marginTop: 2,
  },
  videoContainer: {
    width: '85%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#636366',
    fontSize: 14,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: '#007AFF', 
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#34C759', 
  },
  downloadButton: {
    backgroundColor: '#5856D6', 
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
  metricCard: {
    backgroundColor: '#1C1C1E', 
    width: '47%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  metricLabel: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '700',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  activeSpeedButton: {
    backgroundColor: '#007AFF', // Standard iOS blue active badge highlight
  },
  activeSpeedButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dashboardContainer: {
    width: '100%',
    marginTop: 60,
    marginBottom: 30,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dashboardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  viewAllText: {
    color: '#007AFF', // Clean interactive iOS blue
    fontSize: 13,
    fontWeight: '600',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  historyDate: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  historySubtext: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 2,
  },
  timeBadge: {
    backgroundColor: '#34C75920',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  timeBadgeText: {
    color: '#34C759',
    fontWeight: 'bold',
    fontSize: 13,
  },
  // 🏢 MODAL ARCHIVE STRUCTURE STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dim background overlay effect
    justifyContent: 'flex-end', // Pulls sheet up from the bottom of the device screen
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    height: '75%', // Takes up 75% of the screen height when opened
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
  },
  modalScrollView: {
    flex: 1,
    marginBottom: 20,
  },
  closeModalButton: {
    backgroundColor: '#2C2C2E',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  actionButtonGroup: { width: '100%', alignItems: 'center' },
  resetLink: { marginTop: 14, paddingVertical: 6 },
  resetLinkText: { color: '#8E8E93', fontSize: 13, fontWeight: '500', textDecorationLine: 'underline' },
  floatingSpeedContainer: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    backgroundColor: 'rgba(28, 28, 30, 0.85)', // Glassmorphism backdrop blur look
    borderRadius: 20,
    padding: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  floatingSpeedButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  activeFloatingButton: {
    backgroundColor: '#007AFF',
  },
  floatingSpeedText: {
    color: '#AEAEB2',
    fontSize: 11,
    fontWeight: '600',
  },
  activeFloatingText: {
    color: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    paddingBottom: 10, // offsets safe area spacing on modern home bars
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabItem: {
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
  },
  tabText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '700',
  },
  formContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    width: '100%',
    height: 'auto',
  },
  inputField: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  workoutCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    width: '100%',
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workoutVolumeBadge: {
    backgroundColor: '#007AFF20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  volumeBadgeText: {
    color: '#007AFF',
    fontWeight: '700',
    fontSize: 12,
  },
  workoutNotesText: {
    color: '#AEAEB2',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#2C2C2E',
    paddingTop: 6,
  },
  deleteCardButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteCardButtonText: {
    color: '#FF3B30', // System warning red
    fontSize: 16,
    fontWeight: '600',
  },
  dynamicRepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#1C1C1E',
    padding: 8,
    borderRadius: 8,
    width: '100%',
  },
  repRowNumberLabel: {
    color: '#AEAEB2',
    fontSize: 12,
    fontWeight: '600',
    width: 50,
    marginRight: 4,
  },
  splitsDisplayGrid: {
    marginTop: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 8,
  },
  splitGridLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#3A3A3C',
  },
  splitGridText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: '#343447',
    borderWidth: 1,
    borderColor: '#FF453A', // Nice subtle red border indicating destructive action
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#FF453A',
    fontWeight: '600',
    fontSize: 16,
  },
});
