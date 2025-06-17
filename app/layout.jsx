import './globals.css'
import "react-datepicker/dist/react-datepicker.css";


export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}