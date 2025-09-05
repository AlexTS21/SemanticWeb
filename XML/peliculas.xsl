<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8"/>
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Cartelera de cine</title>
        <link rel="stylesheet" href="style.css"></link>
      </head>
      <body>
        <h2>Estrenos de agosto 2025</h2>
        <div class="grid">
          <xsl:for-each select="cartelera/pelicula">
            <div class="card">
              <div class="titulo"><xsl:value-of select="titulo"/></div>
              <div class="fecha"><xsl:value-of select="fecha"/></div>
              <div class="genero"><xsl:value-of select="genero"/></div>
              <p> Director: <xsl:value-of select="director"/></p>
              <p> Duración: <xsl:value-of select="duracion"/></p>
              <div class="actores">
                Actores: 
                <xsl:for-each select="actores/actor">
                  <xsl:value-of select="."/>
                  <xsl:if test="position()!=last()">, </xsl:if>
                </xsl:for-each>
              </div>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
