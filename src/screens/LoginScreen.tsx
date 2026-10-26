import { useState } from "react";
import {
  View,
  Text,
  TextInput,
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
  loginUser,
  clearAuthError,
  selectAuthLoading,
  selectAuthError,
} from "../store/authSlice";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();

  // Shared (store): is a request running? did it fail?
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  // Local (this page only): what the user typed
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  // Typing again hides the old error
  const onChangeEmail = (text: string) => {
    setEmail(text);
    if (error) dispatch(clearAuthError());
  };
  const onChangePassword = (text: string) => {
    setPassword(text);
    if (error) dispatch(clearAuthError());
  };

  const handleLogin = () => {
    if (!canSubmit) return;
    dispatch(loginUser({ email, password }));
    // No navigate() here: when login succeeds, AppNavigator switches screens by itself
  };

  const goToRegister = () => {
    dispatch(clearAuthError());
    navigation.navigate("Register");
  };

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
          {/* 1. Logo + title */}
          <View style={styles.logo}>
            <Ionicons name="fast-food" size={44} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Welcome back 👋</Text>
          <Text style={styles.subtitle}>Log in to order your favourite food</Text>

          {/* 2. Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={20} color="#777777" />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={onChangeEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="next"
            />
          </View>

          {/* 3. Password with show/hide */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#777777" />
            <TextInput
              style={styles.input}
              placeholder="Your password"
              placeholderTextColor="#999999"
              value={password}
              onChangeText={onChangePassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#777777"
              />
            </Pressable>
          </View>

          {/* 4. Error from the store */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#D93025" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* 5. Log in button: spinner while loading */}
          <Pressable
            style={[styles.button, !canSubmit && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!canSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Log in</Text>
            )}
          </Pressable>

          {/* 6. Link to Register */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <Pressable onPress={goToRegister} hitSlop={8}>
              <Text style={styles.switchLink}>Sign up</Text>
            </Pressable>
          </View>

          {/* Only while the server is fake */}
          <Text style={styles.demoHint}>Demo: fahad@gmail.com / 123456</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222222",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#777777",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444444",
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    marginLeft: 10,
    color: "#222222",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDECEA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  errorText: {
    flex: 1,
    color: "#D93025",
    fontSize: 14,
    marginLeft: 8,
  },
  button: {
    backgroundColor: "#FF5A5F",
    borderRadius: 14,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  switchText: {
    fontSize: 15,
    color: "#777777",
  },
  switchLink: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF5A5F",
  },
  demoHint: {
    fontSize: 13,
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: 24,
  },
});