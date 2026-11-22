import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Moon, Smartphone, Sun } from 'lucide-react-native';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'system', label: 'System', Icon: Smartphone },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateProfile, changePassword } = useAuth();
  const { colors, preference, setTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [name, setName] = useState(user?.name ?? '');
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) return null;

  const saveName = async () => {
    if (name.trim().length < 2) {
      Alert.alert('Invalid Name', 'Your name must be at least 2 characters.');
      return;
    }
    setSavingName(true);
    const result = await updateProfile({ name: name.trim() });
    setSavingName(false);
    Alert.alert(result.ok ? 'Saved' : 'Error', result.ok ? 'Your name has been updated.' : result.error);
  };

  const savePassword = async () => {
    if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Weak Password', 'New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    const result = await changePassword(currentPassword, newPassword);
    setSavingPassword(false);

    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Saved', 'Your password has been changed.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <ArrowLeft size={24} color={colors.accent} onPress={() => router.back()} />
          <Text style={styles.heading}>SETTINGS</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Appearance */}
        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map(({ value, label, Icon }) => {
            const active = preference === value;
            return (
              <Pressable key={value} style={[styles.themeOption, active && styles.themeOptionActive]} onPress={() => setTheme(value)}>
                <Icon size={20} color={active ? colors.onAccent : colors.textMuted} />
                <Text style={[styles.themeLabel, active && { color: colors.onAccent }]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Profile */}
        <Text style={styles.sectionTitle}>EDIT PROFILE</Text>
        <View style={styles.card}>
          <InputField label="Name" value={name} onChangeText={setName} placeholder="Your name" autoCapitalize="words" />
          <Text style={styles.label}>Email</Text>
          <Text style={styles.readOnly}>{user.email}</Text>
          <CustomButton title="SAVE NAME" onPress={saveName} loading={savingName} />
        </View>

        {/* Password */}
        <Text style={styles.sectionTitle}>CHANGE PASSWORD</Text>
        <View style={styles.card}>
          <InputField label="Current password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry placeholder="Current password" />
          <InputField label="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="At least 8 characters" />
          <InputField label="Confirm new password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Repeat new password" />
          <CustomButton title="CHANGE PASSWORD" onPress={savePassword} loading={savingPassword} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    content: { padding: 22, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    heading: { color: c.accent, fontSize: 22, fontWeight: '900', letterSpacing: 3 },
    sectionTitle: { color: c.accent, fontSize: 14, fontWeight: '900', letterSpacing: 2, marginTop: 20, marginBottom: 12 },
    themeRow: { flexDirection: 'row', gap: 10 },
    themeOption: {
      flex: 1, alignItems: 'center', gap: 6, paddingVertical: 14, backgroundColor: c.card,
      borderWidth: 1, borderColor: c.border, borderRadius: 8,
    },
    themeOptionActive: { backgroundColor: c.accent, borderColor: c.accent },
    themeLabel: { color: c.textMuted, fontSize: 12, fontWeight: 'bold' },
    card: { backgroundColor: c.card, borderRadius: 10, padding: 16 },
    label: { color: c.text, fontWeight: 'bold', marginBottom: 6 },
    readOnly: { color: c.textMuted, fontSize: 14 },
  });