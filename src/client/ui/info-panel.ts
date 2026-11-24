/**
 * Rules, paytable and round history as an HTML layer above the canvas:
 * long texts need real scrolling, selectable text and screen-reader access.
 */
export interface InfoTab { id: string; label: string; html: () => string }

const CSS = `
.tls-info { position: fixed; inset: 0; z-index: 10; display: none; background: rgba(5,7,12,.92); color: #f3ead6;
  font: 15px/1.45 Georgia, "Times New Roman", serif; }
.tls-info.open { display: flex; flex-direction: column; }
.tls-info header { display: flex; gap: 6px; padding: 10px; padding-top: max(10px, env(safe-area-inset-top)); align-items: center; flex-wrap: wrap; }
.tls-info button { min-height: 44px; min-width: 44px; padding: 0 14px; border-radius: 12px; border: 2px solid #9a7420;
  background: #222a40; color: #f3ead6; font: inherit; cursor: pointer; }
.tls-info button[aria-selected="true"] { background: #9a7420; }
.tls-info .close { margin-left: auto; }
.tls-info main { flex: 1; overflow-y: auto; padding: 4px 16px 32px; max-width: 760px; width: 100%; box-sizing: border-box; margin: 0 auto; }
.tls-info h3 { color: #ffd76a; margin: 18px 0 6px; font-size: 17px; }
.tls-info ul, .tls-info ol { padding-left: 20px; margin: 6px 0; }
.tls-info li { margin: 4px 0; }
.tls-info .scroll { overflow-x: auto; }
.tls-info table { border-collapse: collapse; width: 100%; font-size: 14px; }
.tls-info th, .tls-info td { padding: 6px 8px; border-bottom: 1px solid #39425e; text-align: right; white-space: nowrap; }
.tls-info th[scope="row"] { text-align: left; font-weight: normal; }
.tls-info th img { width: 28px; height: 28px; vertical-align: middle; margin-right: 8px; }
.tls-info .seed { font-family: ui-monospace, monospace; font-size: 12px; }
.tls-info .dim { color: #9aa3b8; }
`;

export class InfoPanel {
  private readonly root: HTMLDivElement;
  private readonly main: HTMLElement;
  private readonly tabButtons = new Map<string, HTMLButtonElement>();
  onClose: (() => void) | null = null;

  constructor(private readonly tabs: InfoTab[]) {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    this.root = document.createElement('div');
    this.root.className = 'tls-info';
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'true');
    this.root.setAttribute('aria-label', 'Spielinformationen');
    const header = document.createElement('header');
    header.setAttribute('role', 'tablist');
    for (const t of tabs) {
      const b = document.createElement('button');
      b.textContent = t.label;
      b.setAttribute('role', 'tab');
      b.addEventListener('click', () => this.show(t.id));
      this.tabButtons.set(t.id, b);
      header.appendChild(b);
    }
    const close = document.createElement('button');
    close.className = 'close';
    close.textContent = 'Schliessen';
    close.addEventListener('click', () => this.close());
    header.appendChild(close);
    this.main = document.createElement('main');
    this.root.append(header, this.main);
    document.body.appendChild(this.root);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.isOpen) this.close(); });
  }

  get isOpen(): boolean { return this.root.classList.contains('open'); }

  show(id: string): void {
    const tab = this.tabs.find((t) => t.id === id) ?? this.tabs[0];
    this.main.innerHTML = tab.html();
    this.main.scrollTop = 0;
    this.tabButtons.forEach((b, key) => b.setAttribute('aria-selected', String(key === tab.id)));
    this.root.classList.add('open');
    this.tabButtons.get(tab.id)?.focus();
  }

  close(): void {
    this.root.classList.remove('open');
    this.onClose?.();
  }
}
