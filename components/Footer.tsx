export default function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="container mx-auto p-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} FutsalKu. Dibuat untuk Tugas Kuliah.</p>
      </div>
    </footer>
  );
}