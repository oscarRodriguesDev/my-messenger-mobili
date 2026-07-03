import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, SafeAreaView, Platform } from 'react-native';
import { WebView, WebViewNavigation, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const APP_URL = 'https://mymessenger-ten.vercel.app';

export default function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pageTitle, setPageTitle] = useState('whats-mobile');

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      // Atualiza o título da página quando disponível
      if (navState.title) {
        setPageTitle(navState.title);
      }
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

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    // Recebe mensagens do WebView (útil para comunicação com a web app)
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Mensagem recebida do WebView:', data);
    } catch {
      console.log('Dados recebidos:', event.nativeEvent.data);
    }
  }, []);

  // Injeção de JavaScript para desabilitar zoom e configurar viewport
  const injectedJavaScript = `
    (function() {
      // Desabilita zoom e pinch
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(meta);
      
      // Previne zoom por double-tap
      document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      }, { passive: false });
      
      let lastTouchEnd = 0;
      document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
      
      // Habilita permissões para câmera e microfone no WebView
      window.addEventListener('message', function(event) {
        console.log('WebView recebeu mensagem:', event.data);
      });
    })();
    true;
  `;

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
    <SafeAreaView style={styles.safeArea}>
      {/* Barra Superior (Header) */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="chatbubbles" size={24} color="#fff" />
          <Text style={styles.headerTitle}>{pageTitle}</Text>
        </View>
      </View>

      {/* WebView Centralizado */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: APP_URL }}
          style={styles.webview}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={handleMessage}
          injectedJavaScript={injectedJavaScript}
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
          // DESABILITAR ZOOM
          scalesPageToFit={Platform.OS === 'android'}
          bounces={false}
          // Configurações de zoom (iOS e Android)
          scrollEnabled={true}
          // Permissões para câmera, microfone e galeria
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          webviewDebuggingEnabled={__DEV__}
          // Habilita acesso a mídia
          allowsPictureInPictureMediaPlayback={true}
          // Configurações específicas Android
          androidHardwareAccelerationDisabled={false}
          mixedContentMode="always"
        />
      </View>

      {/* Barra Inferior (Footer) */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>whats-mobile</Text>
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: 12,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  footer: {
    backgroundColor: '#f8f8f8',
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
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
