<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>Recetario</title>
        <link rel="stylesheet" href="style.css"></link>
      </head>
      <body>
        <h2>Recetario</h2>
        <xsl:apply-templates select="recetario/receta"/>
      </body>
    </html>
  </xsl:template>
  <!-- Plantilla para cada receta -->
  <xsl:template match="receta">
    <div class="receta">
      <h2><xsl:value-of select="@nombre"/></h2>

      <!-- Ingredientes -->
      <h3>Ingredientes</h3>
      <ul>
        <xsl:for-each select="ingredientes/ingrediente">
          <li>
            <xsl:value-of select="@cantidad"/> 
            <xsl:value-of select="@unidad"/> - 
            <xsl:value-of select="normalize-space(.)"/>
          </li>
        </xsl:for-each>
      </ul>

      <!-- Procedimiento -->
      <h3>Procedimiento</h3>
      <ol>
        <xsl:for-each select="procedimiento/paso">
          <li><xsl:value-of select="."/></li>
        </xsl:for-each>
      </ol>

      <!-- Detalles -->
      <div class="detalles">
        ⏱ Duración: <xsl:value-of select="detalles/duracion"/> <br/>
        🍽 Porciones: <xsl:value-of select="detalles/porciones"/> 
        (<xsl:value-of select="detalles/porciones/@unidad"/>)
      </div>
    </div>
  </xsl:template>

</xsl:stylesheet>
