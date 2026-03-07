import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  username: string;
  resetLink: string;
}

export default function ForgotPasswordEmail({
  username,
  resetLink,
}: ResetPasswordEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset Your Password</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Password reset request</Preview>

      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>

        <Row>
          <Text>
            We received a request to reset your password for your Anonymous
            Message account.
          </Text>
        </Row>

        <Row>
          <Text>Click the button below to reset your password.</Text>
        </Row>

        <Row>
          <Button
            href={resetLink}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            Reset Password
          </Button>
        </Row>

        <Row>
          <Text>
            If you did not request a password reset, please ignore this email.
          </Text>
        </Row>

        <Row>
          <Text>This link will expire in 15 minutes.</Text>
        </Row>
      </Section>
    </Html>
  );
}