import mjml2html from 'mjml';

// See https://documentation.mjml.io/#getting-started for customizing the email template below

// TODO: Break up this file into multiple .mjml files and include them using the mj-include tag
export const PasswordResetRequestEmailHtml = (options) => {
  const {
    appName,
    textColor,
    escapedEmail,
    mainBackgroundColor,
    buttonTextColor,
    buttonBackgroundColor,
    url,
    fontFamily,
  } = options;

  const output = mjml2html(`<mjml>
      <mj-head>
        <mj-attributes>
          <mj-all font-family="${fontFamily}" />
          <mj-class name="h1" font-size="24px" font-weight="400" />
          <mj-class name="p" font-size="16px" font-weight="400" line-height="1.5" color="${textColor}" />
        </mj-attributes>
      </mj-head>
      <mj-body>
        <mj-section background-color="${mainBackgroundColor}">
          <mj-column>
            <!-- Company Header -->
            <mj-text mj-class="h1" align="center" font-size="20px" color="${textColor}">${appName}</mj-text>
            <mj-divider border-color="#cccccc"></mj-divider>
            <!-- Main Content -->
            <mj-text mj-class="h1">Use this link to reset your password to ${appName}</mj-text>
            <mj-text mj-class="p">You requested a password reset link, and here it is! Note that this link expires after 1 hour and can only be used once.</mj-text>
            <mj-button font-size="20px" padding="0" color="${buttonTextColor}" background-color="${buttonBackgroundColor}">
              <a href="${url}" target="_blank" style="display: block; color: ${buttonTextColor}; text-decoration: none; padding: 10px 20px;">Reset My Password</a>
            </mj-button>
            <mj-divider border-color="#cccccc"></mj-divider>
            <mj-text mj-class="p">If you did not request this email you can safely ignore it.</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `);

  return output.html;
};
