export class ViewportService {
  constructor(private readonly mobileQuery: MediaQueryList) {}

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }

  onChange(listener: (isMobile: boolean) => void): () => void {
    const handler = (event: MediaQueryListEvent) => listener(event.matches);
    this.mobileQuery.addEventListener('change', handler);
    return () => this.mobileQuery.removeEventListener('change', handler);
  }
}
