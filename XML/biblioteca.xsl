<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Biblioteca</title>
        <link rel="stylesheet" href="style.css"></link>
      </head>
      <body>
        <h2>Biblioteca</h2>
        <xsl:for-each select="biblioteca/libro">
          <div class="libro">
            <h2><xsl:value-of select="titulo"/></h2>
            <p class="autor">Autor: <xsl:value-of select="autor"/></p>
            <p class="genero">Género: <xsl:value-of select="genero"/></p>
            <p class="sinopsis"><xsl:value-of select="normalize-space(sinopsis)"/></p>
            <p class="meta">
              Publicado en: <xsl:value-of select="fecha_publicacion"/> |
              Páginas: <xsl:value-of select="paginas"/>
            </p>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
