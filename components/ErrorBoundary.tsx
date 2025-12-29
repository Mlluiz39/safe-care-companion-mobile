import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../constants/colors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Ops! Algo deu errado.</Text>
          <Text style={styles.subtitle}>Ocorreu um erro inesperado.</Text>
          
          <ScrollView style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {this.state.error && this.state.error.toString()}
            </Text>
            {this.state.errorInfo && (
              <Text style={styles.errorInfo}>
                {this.state.errorInfo.componentStack}
              </Text>
            )}
          </ScrollView>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.buttonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.destructive.DEFAULT,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.foreground,
    marginBottom: 20,
  },
  errorContainer: {
    width: '100%',
    maxHeight: 400,
    backgroundColor: colors.muted.DEFAULT,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: colors.destructive.DEFAULT,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorInfo: {
    color: colors.muted.foreground,
    fontSize: 12,
  },
  button: {
    backgroundColor: colors.primary.DEFAULT,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;
