import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
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
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  async function signInWithEmail() {
    if (!email || !password) {
      alert('Por favor, preencha email e senha')
      return
    }

    setLoading(true)
    
    if (isSignUp) {
      // Cadastro
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (error) {
        alert(error.message)
      } else {
        alert('Conta criada com sucesso! Verifique seu email para confirmar.')
      }
    } else {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        alert(error.message)
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

        <Pressable
          onPress={() => setIsSignUp(!isSignUp)}
          style={styles.toggleButton}
        >
          <Text style={styles.footerText}>
            {isSignUp ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
            <Text style={styles.linkText}>
              {isSignUp ? 'Entrar' : 'Cadastre-se'}
            </Text>
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
  toggleButton: {
    marginTop: spacing.lg * 2,
  },
})
