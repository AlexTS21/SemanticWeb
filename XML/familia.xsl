<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Familia</title>
        <link rel="stylesheet" href="style.css"></link>
      </head> 
      <body>
        <h2>Familia</h2>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nombres</th>
              <th>Apellido paterno</th>
              <th>Apellido materno</th>
              <th>Edad</th>
              <th>Cumpleaños (dd-mm)</th>
            </tr>
          </thead>
          <tbody>
            <!-- Recorre todos los hijos de <familia>: individio, padre, madre, hermano -->
            <xsl:for-each select="familia/*">
              <tr>
                <!-- Tipo: nombre del elemento (individio, padre, madre, hermano) -->
                <td><xsl:value-of select="name()"/></td>
                <!-- Nombres: concatena todos los <nombre> separados por espacio -->
                <td>
                  <xsl:for-each select="nombre">
                    <xsl:if test="position() &gt; 1"> </xsl:if>
                    <xsl:value-of select="normalize-space(.)"/>
                  </xsl:for-each>
                </td>
                <td><xsl:value-of select="normalize-space(paterno)"/></td>
                <td><xsl:value-of select="normalize-space(materno)"/></td>
                <td><xsl:value-of select="normalize-space(edad)"/></td>
                <td><xsl:value-of select="normalize-space(fechaCumpleaños)"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
