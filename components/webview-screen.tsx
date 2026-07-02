import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

const APP_URL = 'https://mymessenger-ten.vercel.app';

export default function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleNavigationStateChange = useCallback(
    (_navState: WebViewNavigation) => {
      // Futuramente: tracking de navegação, deep links, etc.
    },
    [],
  );

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
        <Text style={styles.errorMessage}>
          Não foi possível carregar o aplicativo. Verifique sua conexão com a internet e
          tente novamente.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: APP_URL }}
        style={styles.webview}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onNavigationStateChange={handleNavigationStateChange}
        // Persistência de sessão (cookies)
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        // Cache e armazenamento
        cacheEnabled={true}
        domStorageEnabled={true}
        // JavaScript habilitado
        javaScriptEnabled={true}
        // Permitir que links externos abram
        javaScriptCanOpenWindowsAutomatically={true}
        // Gestos de navegação (voltar/avançar)
        allowsBackForwardNavigationGestures={true}
        // Acessar arquivos locais se necessário
        allowFileAccess={true}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666666',
    lineHeight: 22,
  },
});
