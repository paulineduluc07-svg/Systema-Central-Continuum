import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { debounce } from '@/lib/utils';

interface WhiteboardProps {
  tabId: string;
  className?: string;
}

export function Whiteboard({ tabId, className }: WhiteboardProps) {
  const { isAuthenticated } = useAuth();
  const editorRef = useRef<any>(null);
  const hasLoadedRef = useRef(false);

  // Load canvas data from server
  const { data: canvasData } = trpc.canvas.get.useQuery(
    { tabId },
    { enabled: isAuthenticated }
  );

  // Save mutation
  const saveMutation = trpc.canvas.save.useMutation();

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((data: string) => {
      if (isAuthenticated) {
        saveMutation.mutate({ tabId, data });
      } else {
        // Save to localStorage for offline mode
        localStorage.setItem(`canvas_${tabId}`, data);
      }
    }, 1500),
    [tabId, isAuthenticated]
  );

  // Handle editor mount
  const handleMount = useCallback((editor: any) => {
    editorRef.current = editor;

    // Load saved data after a short delay to ensure editor is ready
    setTimeout(() => {
      if (hasLoadedRef.current) return;
      
      let dataToLoad = null;
      
      if (canvasData?.data) {
        dataToLoad = canvasData.data;
      } else if (!isAuthenticated) {
        dataToLoad = localStorage.getItem(`canvas_${tabId}`);
      }

      if (dataToLoad) {
        try {
          const snapshot = JSON.parse(dataToLoad);
          if (snapshot && editor.store) {
            editor.store.loadSnapshot(snapshot);
            hasLoadedRef.current = true;
          }
        } catch (e) {
          console.error('Failed to load canvas data:', e);
        }
      }
    }, 100);

    // Subscribe to changes for auto-save
    const unsubscribe = editor.store.listen(() => {
      const snapshot = editor.store.getSnapshot();
      debouncedSave(JSON.stringify(snapshot));
    }, { source: 'user', scope: 'document' });

    return () => {
      unsubscribe();
    };
  }, [canvasData, isAuthenticated, tabId, debouncedSave]);

  // Reset loaded flag when tab changes
  useEffect(() => {
    hasLoadedRef.current = false;
  }, [tabId]);

  return (
    <div className={`tldraw__editor ${className || ''}`} style={{ width: '100%', height: '100%' }}>
      <Tldraw
        onMount={handleMount}
        persistenceKey={`whiteboard-${tabId}`}
      />
    </div>
  );
}

export default Whiteboard;
