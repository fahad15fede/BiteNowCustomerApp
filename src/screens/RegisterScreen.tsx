import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "../navigation/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  registerUser,
  clearAuthError,
  selectAuthLoading,
  selectAuthError,
} from "../store/authSlice";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;
type IconName = React.ComponentProps<typeof Ionicons>["name"];

// ─────────────────────────────────────────────
// One labelled input with an icon. Used 5 times below.
// It accepts ALL normal TextInput props, plus a label and an icon.
// ─────────────────────────────────────────────
type FieldProps = TextInputProps & {
  label: string;
  icon: IconName;
  right?: React.ReactNode; // optional thing on the right (the eye button)
};

function FormField({ label, icon, right, ...inputProps }: FieldProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <Ionicons name={icon} size={20} color="#777777" />
        <TextInput
          style={styles.input}
          placeholderTextColor="#999999"
          autoCorrect={false}
          {...inputProps}
        />
        {right}
      </View>
    </>
  );
}

// ─────────────────────────────────────────────
// The page
// ─────────────────────────────────────────────
export default function RegisterScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const serverError = useAppSelector(selectAuthError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Checks done ON THE PHONE (instant, no server needed) ──
  const allFilled = [name, email, phone, password, confirmPassword].every(
    (value) => value.trim().length > 0
  );
  const passwordTooShort = password.length > 0 && password.length < 6;
  const passwordsDontMatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  // The message to show: a phone check first, otherwise the server's error
  const formError = passwordTooShort
    ? "Password must be at least 6 characters."
    : passwordsDontMatch
    ? "Passwords don't match."
    : serverError;

  const canSubmit = allFilled && !passwordTooShort && !passwordsDontMatch && !loading;

  // Wrap a setter: update the text AND hide an old server error
  const editing = (setter: (text: string) => void) => (text: string) => {
    setter(text);
    if (serverError) dispatch(clearAuthError());
  };

  const handleRegister = () => {
    if (!canSubmit) return;
    dispatch(registerUser({ name, email, phone, password }));
    // Success → logged in → AppNavigator switches to the app by itself
  };

  const goToLogin = () => {
    dispatch(clearAuthError());
    navigation.goBack();
  };

  const eyeButton = (
    <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
      <Ionicons
        name={showPassword ? "eye-off-outline" : "eye-outline"}
        size={20}
        color="#777777"
      />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. Title */}
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to start ordering</Text>

          {/* 2. Fields */}
          <FormField
            label="Full name"
            icon="person-outline"
            placeholder="Muhammad Fahad"
            value={name}
            onChangeText={editing(setName)}
            autoCapitalize="words"
            autoComplete="name"
          />
          <FormField
            label="Email"
            icon="mail-outline"
            placeholder="you@example.com"
            value={email}
            onChangeText={editing(setEmail)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <FormField
            label="Phone"
            icon="call-outline"
            placeholder="03001234567"
            value={phone}
            onChangeText={editing(setPhone)}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          <FormField
            label="Password"
            icon="lock-closed-outline"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={editing(setPassword)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            right={eyeButton}
          />
          <FormField
            label="Confirm password"
            icon="lock-closed-outline"
            placeholder="Type it again"
            value={confirmPassword}
            onChangeText={editing(setConfirmPassword)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            returnKeyType="go"
            onSubmitEditing={handleRegister}
          />

          {/* 3. Error: from the phone checks OR the server */}
          {formError ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#D93025" />
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}

          {/* 4. Button */}
          <Pressable
            style={[styles.button, !canSubmit && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={!canSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign up</Text>
            )}
          </Pressable>

          {/* 5. Back to Login */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Pressable onPress={goToLogin} hitSlop={8}>
              <Text style={styles.switchLink}>Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#222222" },
  subtitle: { fontSize: 15, color: "#777777", marginTop: 6, marginBottom: 28 },
  label: { fontSize: 14, fontWeight: "600", color: "#444444", marginBottom: 8 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 14, marginLeft: 10, color: "#222222" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDECEA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { flex: 1, color: "#D93025", fontSize: 14, marginLeft: 8 },
  button: {
    backgroundColor: "#FF5A5F",
    borderRadius: 14,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  switchRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  switchText: { fontSize: 15, color: "#777777" },
  switchLink: { fontSize: 15, fontWeight: "700", color: "#FF5A5F" },
});