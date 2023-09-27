type colorScheme = 'light' | 'dark' | 'auto';
type functionCallback = (e: MediaQueryListEvent) => void;

class StackColorScheme {
    private localStorageKey = 'StackColorScheme';
    private currentScheme: colorScheme;
    private systemPreferScheme: colorScheme;
    private eventListener: functionCallback;

    constructor(toggleEl: HTMLElement) {
        this.currentScheme = this.getSavedScheme();
        
        this.updateButtonDisplay();

        this.dispatchEvent(document.documentElement.dataset.scheme as colorScheme);

        if (toggleEl)
            this.bindClick(toggleEl);

        if (document.body.style.transition == '')
            document.body.style.setProperty('transition', 'background-color .3s ease');
        
        this.eventListener = function(e: MediaQueryListEvent) : void {
            if (this.currentScheme == 'auto') {
                if (e.matches) {
                    this.systemPreferScheme = 'dark';
                    console.log(this.systemPreferScheme);
                }
                else {
                    this.systemPreferScheme = 'light';
                }
                this.setBodyClass();
            }
        }
    }

    private saveScheme() {
        localStorage.setItem(this.localStorageKey, this.currentScheme);
    }

    private updateScheme() {
        if (this.currentScheme == 'dark') {
            this.currentScheme = 'light';
        }
        else if (this.currentScheme == 'auto') {
            this.currentScheme = 'dark';
        }
        else {
            this.currentScheme = 'auto';
        }
    }

    private updateButtonDisplay() {
        var elem_left_display = 'none';
        var elem_center_display = 'none';
        var elem_right_display = 'none';
        var elem_light_display = 'none';
        var elem_auto_display = 'none';
        var elem_dark_display = 'none';

        if (this.currentScheme == 'light') {
            elem_left_display = 'block';
            elem_light_display = 'block';
        }
        else if (this.currentScheme == 'dark') {
            this.dispatchMatchMedia();
            elem_right_display = 'block';
            elem_dark_display = 'block';
        }
        else {
            this.bindMatchMedia();
            elem_center_display = 'block';
            elem_auto_display = 'block';
        }
        

        var elem = <HTMLElement>document.getElementsByClassName('icon-tabler-toggle-left')[0];
        elem.style.display = elem_left_display;
        var elem = <HTMLElement>document.getElementsByClassName('icon-tabler-toggle-center')[0];
        elem.style.display = elem_center_display;
        var elem = <HTMLElement>document.getElementsByClassName('icon-tabler-toggle-right')[0];
        elem.style.display = elem_right_display;
        elem = document.getElementById('dark-mode-light');
        elem.style.display = elem_light_display;
        elem = document.getElementById('dark-mode-auto');
        elem.style.display = elem_auto_display;
        elem = document.getElementById('dark-mode-dark');
        elem.style.display = elem_dark_display;
    }

    private bindClick(toggleEl: HTMLElement) {
        toggleEl.addEventListener('click', (e) => {
            this.updateScheme();

            this.updateButtonDisplay();

            this.setBodyClass();

            this.saveScheme();
        })
    }

    private isDark() {
        return (this.currentScheme == 'dark' || this.currentScheme == 'auto' && this.systemPreferScheme == 'dark');
    }

    private dispatchEvent(colorScheme: colorScheme) {
        const event = new CustomEvent('onColorSchemeChange', {
            detail: colorScheme
        });
        window.dispatchEvent(event);
    }

    private setBodyClass() {
        if (this.isDark()) {
            document.documentElement.dataset.scheme = 'dark';
        }
        else {
            document.documentElement.dataset.scheme = 'light';
        }

        this.dispatchEvent(document.documentElement.dataset.scheme as colorScheme);
    }

    private getSavedScheme(): colorScheme {
        const savedScheme = localStorage.getItem(this.localStorageKey);

        if (savedScheme == 'light' || savedScheme == 'dark' || savedScheme == 'auto') return savedScheme;
        else return 'auto';
    }



    private bindMatchMedia() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.eventListener);
    }

    private dispatchMatchMedia() {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.eventListener);
    }
}

export default StackColorScheme;
