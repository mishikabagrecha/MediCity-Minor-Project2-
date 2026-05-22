import React from 'react';

export class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex items-center justify-center bg-slate-950/90 text-slate-100 p-6 text-center">
          <div>
            <p className="text-lg font-semibold mb-2">3D model failed to load.</p>
            <p className="text-sm text-slate-300">Place a valid GLB/GLTF file at <code className="rounded bg-slate-900 px-1.5 py-0.5">/models/medical-professional.glb</code> and refresh.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
