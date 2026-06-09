module.exports = {
  "content": [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./build-output/**/*.{html,js,ts,jsx,tsx}"
  ],
  "theme": {
    "extend": {
      "colors": {
        "primary": {
          "50": "#eff6ff",
          "100": "#dbeafe",
          "500": "#3b82f6",
          "600": "#2563eb",
          "700": "#1d4ed8",
          "900": "#1e3a8a"
        },
        "secondary": {
          "500": "#8b5cf6",
          "600": "#7c3aed"
        },
        "accent": {
          "500": "#06b6d4"
        }
      },
      "fontFamily": {
        "sans": [
          "Inter",
          "system-ui",
          "sans-serif"
        ]
      },
      "spacing": {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem"
      },
      "animation": {
        "bounce-slow": "bounce 2s infinite",
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out"
      },
      "keyframes": {
        "fadeIn": {
          "0%": {
            "opacity": "0",
            "transform": "translateY(30px)"
          },
          "100%": {
            "opacity": "1",
            "transform": "translateY(0)"
          }
        },
        "slideUp": {
          "0%": {
            "opacity": "0",
            "transform": "translateY(50px)"
          },
          "100%": {
            "opacity": "1",
            "transform": "translateY(0)"
          }
        }
      }
    }
  },
  "plugins": [
    null
  ]
}