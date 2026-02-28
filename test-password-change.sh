#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Testing Password Change Functionality${NC}\n"

API_URL="http://localhost:5000/api"

# Test credentials
TEST_EMAIL="test@example.com"
TEST_PASSWORD="testpass123"
NEW_PASSWORD="newpass456"

echo -e "${YELLOW}1️⃣ Registering test user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"role\": \"team_member\"
  }")

echo "Response: $REGISTER_RESPONSE"

# Extract token from register response
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Failed to get token from registration${NC}"
  # Try logging in instead
  echo -e "${YELLOW}Trying login instead...${NC}"
  LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$TEST_EMAIL\",
      \"password\": \"$TEST_PASSWORD\"
    }")
  
  echo "Login Response: $LOGIN_RESPONSE"
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Could not obtain authentication token${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Got token: ${TOKEN:0:20}...${NC}\n"

echo -e "${YELLOW}2️⃣ Changing password...${NC}"
CHANGE_RESPONSE=$(curl -s -X PUT "$API_URL/auth/change-password" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"currentPassword\": \"$TEST_PASSWORD\",
    \"newPassword\": \"$NEW_PASSWORD\"
  }")

echo "Change Response: $CHANGE_RESPONSE"

if echo "$CHANGE_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Password change returned success${NC}\n"
else
  echo -e "${RED}❌ Password change failed${NC}\n"
fi

echo -e "${YELLOW}3️⃣ Testing old password (should fail)...${NC}"
OLD_PASSWORD_TEST=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Old password test: $OLD_PASSWORD_TEST"

if echo "$OLD_PASSWORD_TEST" | grep -q '"error"'; then
  echo -e "${GREEN}✓ Old password correctly rejected${NC}\n"
else
  echo -e "${RED}❌ Old password still works (password not updated in DB)${NC}\n"
fi

echo -e "${YELLOW}4️⃣ Testing new password (should succeed)...${NC}"
NEW_PASSWORD_TEST=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$NEW_PASSWORD\"
  }")

echo "New password test: $NEW_PASSWORD_TEST"

if echo "$NEW_PASSWORD_TEST" | grep -q '"token"'; then
  echo -e "${GREEN}✓ New password works! Password successfully updated in DB${NC}\n"
else
  echo -e "${RED}❌ New password doesn't work (password not in DB)${NC}\n"
fi
