<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Música</title>
        <link rel="stylesheet" href="style.css"></link>
      </head>
      <body>
        <h2>Álbumes</h2>
        <div class="grid">
          <xsl:for-each select="musica/album">
            <div class="card">
              <div class="titulo"><xsl:value-of select="@titulo"/></div>
              <div class="artista"><xsl:value-of select="artista"/></div>
              <div class="info">
                <p>Duración: <xsl:value-of select="duracion"/></p>
                <p>Canciones: <xsl:value-of select="NumCanciones"/></p>
                <p class="fecha">Fecha: <xsl:value-of select="fecha"/></p>
                <p>Género: <xsl:value-of select="genero"/></p>
                <p>Discográfica: <xsl:value-of select="discografica"/></p>
              </div>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
