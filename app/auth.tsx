import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native'
import { supabase } from '../lib/supabase'
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  colorsWithOpacity,
  fontSize,
  fontWeight,
  borderRadius,
  spacing,
} from '../constants/colors'

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('') // Added name state
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  async function signInWithEmail() {
    if (!email || !password || (isSignUp && !name)) { // Validate name on sign up
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.')
      return
    }

    setLoading(true)

    if (isSignUp) {
      // Cadastro
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name, // Save name to metadata
          },
        },
      })

      if (error) {
        Alert.alert('Erro', error.message)
      } else {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Verifique seu email para confirmar.')
      }
    } else {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        Alert.alert('Erro', error.message)
      }
    }

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundOverlay} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="heart-circle" size={64} color={colors.primary.DEFAULT} />
          <Text style={styles.title}>Cuidado com a Saúde</Text>
          <Text style={styles.subtitle}>Entre para continuar</Text>
        </View>

        <View style={styles.form}>
          {isSignUp && ( // Show name input only for sign up
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="Seu nome"
                placeholderTextColor={colors.muted.foreground}
              />
            </View>
          )}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="email@address.com"
              placeholderTextColor={colors.muted.foreground}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              secureTextEntry
              placeholder="Sua senha"
              placeholderTextColor={colors.muted.foreground}
              autoCapitalize="none"
            />
          </View>
        </View>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={signInWithEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </Text>
          )}
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.divider} />
        </View>

        <Pressable
          onPress={() => setIsSignUp(!isSignUp)}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>
            {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem conta? Cadastre-se'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg * 2,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colorsWithOpacity['primary/5'],
  },
  content: {
    width: '100%',
    maxWidth: 384,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.muted.foreground,
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    height: 48,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.base,
    color: colors.foreground,
  },
  button: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: borderRadius.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg * 2,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    color: colors.primary.foreground,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  footerText: {
    textAlign: 'center',
    color: colors.muted.foreground,
    marginTop: spacing.lg * 2,
  },
  linkText: {
    color: colors.primary.DEFAULT,
    fontWeight: fontWeight.semibold,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.muted.foreground,
    fontSize: fontSize.sm,
  },
  secondaryButton: {
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.DEFAULT,
  },
  secondaryButtonText: {
    color: colors.primary.DEFAULT,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.base,
  },
  toggleButton: {
    marginTop: spacing.lg * 2,
  },
})
